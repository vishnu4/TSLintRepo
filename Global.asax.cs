using CoBRAMVC4Portal.DI.SM.Registries;
using MvcSiteMapProvider.Loader;
using MvcSiteMapProvider.Web.Mvc;
using MvcSiteMapProvider.Xml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.WebPages;
using StackExchange.Profiling;
using StackExchange.Profiling.Mvc;
using StackExchange.Profiling.Storage;

namespace CoBRAMVC4Portal
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        private static MiniProfilerOptions ProfilerOptions;
        protected void Application_BeginRequest()
        {
            MiniProfiler profiler = null;
            if (DGI.CoBRA.Web.BusinessObjects.ServerApplicationSettings.ShowProfiler)
            {
                profiler = ProfilerOptions.StartProfiler();
            }
        }

        protected void Application_EndRequest()
        {
            MiniProfiler.Current?.Stop();
        }

        protected void Application_Start()
        {
            ViewEngines.Engines.Clear();
            if (DGI.CoBRA.Web.BusinessObjects.ServerApplicationSettings.ShowProfiler)
            {
                InitProfilerSettings();
                ViewEngines.Engines.Add(new StackExchange.Profiling.Mvc.ProfilingViewEngine(new CustomClasses.HTMLHelpers.CustomViewEngine()));
            }
            else
            {
                ViewEngines.Engines.Add(new CustomClasses.HTMLHelpers.CustomViewEngine());
            }

#if DEBUG
            Microsoft.ApplicationInsights.Extensibility.TelemetryConfiguration.Active.DisableTelemetry = true;
#endif
            //SqlServerTypes.Utilities.LoadNativeAssemblies(Server.MapPath("~/bin"));

            //http://www.asp.net/mvc/overview/performance/using-asynchronous-methods-in-aspnet-mvc-4
            //System.Net.ServicePointManager.DefaultConnectionLimit= 

            ModelMetadataProviders.Current = new CachedDataAnnotationsModelMetadataProvider();
            AreaRegistration.RegisterAllAreas();

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            //http://www.troyhunt.com/2012/02/shhh-dont-let-your-response-headers.html
            MvcHandler.DisableMvcResponseHeader = true;

            DisplayModeProvider.Instance.Modes.Insert(0, new DefaultDisplayMode("iphone")
            {
                ContextCondition = Context =>
                                Context.Request.Browser["HardwareModel"] == "iPhone"
            });

            DisplayModeProvider.Instance.Modes.Insert(1, new DefaultDisplayMode("android")
            {
                ContextCondition = Context =>
                                Context.Request.Browser["PlatformName"] == "Android"
            });

            DisplayModeProvider.Instance.Modes.Insert(2, new DefaultDisplayMode("mobile")
            {
                ContextCondition = Context =>
                                Context.Request.Browser["IsMobile"] == "True"
            });

        }

        //protected async Task Application_PostAuthenticateRequest(object sender, EventArgs e)
        //{
        //    if (User == null)
        //    {
        //        return;
        //    }

        //    var userManager = CoBRAMVC4Portal.App_Start.StructuremapMvc.StructureMapDependencyScope.Container.GetInstance<CustomUserManager>();
        //    ApplicationUser user = await userManager.FindByNameAsync(User.Identity.Name);
        //    HttpContext.Current.User = new CustomPrincipal((System.Security.Principal.WindowsIdentity)User.Identity, user);
        //}

        protected void Application_PostAuthenticateRequest(object sender, EventArgs e)
        {
            if ((User == null) || (User.Identity == null) || (string.IsNullOrEmpty(User.Identity.Name)))
            {
                return;
            }
            //System.Security.Principal.WindowsIdentity i = System.Security.Principal.WindowsIdentity.GetCurrent(); //always default app pool user.  not useful
            if ((DGI.CoBRA.Web.BusinessObjects.ServerApplicationSettings.UseWindowsAuthentication) && (User.Identity.GetType() == typeof(System.Security.Principal.WindowsIdentity)))   //maybe replace this with web.config UseWindowsAuthentication?  Or replace THAT with this check?
            {
                ApplicationUser user = CoBRAMVC4Portal.Controllers.baseController.staticPCustomUserManager.FindByNameAsync(User.Identity.Name).Result;  //not happy about this at all.  need to find a better way
                //ApplicationUser user = userManager.FindByName(User.Identity.Name);  
                HttpContext.Current.User = new CustomWinPrincipal((System.Security.Principal.WindowsIdentity)User.Identity, user, CoBRAMVC4Portal.Controllers.baseController.staticroleService);
            }
        }


        private void InitProfilerSettings()
        {
            // A powerful feature of the MiniProfiler is the ability to share links to results with other developers.
            // by default, however, long-term result caching is done in HttpRuntime.Cache, which is very volatile.
            // 
            // Let's rig up serialization of our profiler results to a database, so they survive app restarts.
            var options = ProfilerOptions = new MiniProfilerOptions
            {
                // Sets up the WebRequestProfilerProvider with
                // ~/profiler as the route path to use (e.g. /profiler/mini-profiler-includes.js)
                RouteBasePath = "~/profiler",
                // Setting up a MultiStorage provider. This will store results in the MemoryCacheStorage (normally the default) and in SqlLite as well.
                Storage = new MultiStorageProvider(
                    new MemoryCacheStorage(new TimeSpan(1, 0, 0))
                    // The RecreateDatabase call is only done for testing purposes, so we don't check in the db to source control.
                    //new SqliteMiniProfilerStorage(ConnectionString).RecreateDatabase("create table RouteHits(RouteName,HitCount,unique(RouteName))")
                    ),
                // Different RDBMS have different ways of declaring sql parameters - SQLite can understand inline sql parameters just fine.
                // By default, sql parameters will be displayed.
                SqlFormatter = new StackExchange.Profiling.SqlFormatters.InlineFormatter(),
                // These settings are optional and all have defaults, any matching setting specified in .RenderIncludes() will
                // override the application-wide defaults specified here, for example if you had both:
                //    PopupRenderPosition = RenderPosition.Right;
                //    and in the page:
                //    @MiniProfiler.RenderIncludes(position: RenderPosition.Left)
                // ...then the position would be on the left that that page, and on the right (the app default) for anywhere that doesn't
                // specified position in the .RenderIncludes() call.
                PopupRenderPosition = RenderPosition.Right,  // defaults to left
                PopupMaxTracesToShow = 10,                   // defaults to 15
                // ResultsAuthorize (optional - open to all by default):
                // because profiler results can contain sensitive data (e.g. sql queries with parameter values displayed), we
                // can define a function that will authorize clients to see the json or full page results.
                // we use it on http://stackoverflow.com to check that the request cookies belong to a valid developer.
                ResultsAuthorize = request =>
                {
                    // you may implement this if you need to restrict visibility of profiling on a per request basis
                    // for example, for this specific path, we'll only allow profiling if a query parameter is set
                    //if ("/Home/ResultsAuthorization".Equals(request.Url.LocalPath, StringComparison.OrdinalIgnoreCase))
                    //{
                    //return (request.Url.Query).ToLower().Contains("isauthorized");
                    //}
                    // all other paths can check our global switch
                    return DGI.CoBRA.Web.BusinessObjects.ServerApplicationSettings.ShowProfiler;
                },
                // ResultsListAuthorize (optional - open to all by default)
                // the list of all sessions in the store is restricted by default, you must return true to allow it
                ResultsListAuthorize = request =>
                {
                    // you may implement this if you need to restrict visibility of profiling lists on a per request basis 
                    return true; // all requests are legit in our happy world
                },
                // Stack trace settings
                StackMaxLength = 256, // default is 120 characters
            }
            // Optional settings to control the stack trace output in the details pane
            .ExcludeType("SessionFactory")  // Ignore any class with the name of SessionFactory)
            .ExcludeAssembly("NHibernate")  // Ignore any assembly named NHibernate
            .ExcludeMethod("Flush");        // Ignore any method with the name of Flush

            MiniProfilerHandler.Configure(options);
        }
    }


}