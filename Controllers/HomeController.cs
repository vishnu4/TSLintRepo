using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Threading;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using System.Web.WebPages;
using System.Data;
using System.Threading.Tasks;
using DGI.CoBRAPlugInSDK.CoBRAObjects;
using DGI.CoBRAPlugInSDK.CoBRAObjects.RoleExtensions;
using DGI.CoBRA.Web.BusinessObjects;
using CoBRAMVC4Portal.CustomClasses.HTMLHelpers;
using System.Collections;
using System.IO;
using System.Collections.Concurrent;
using AutoMapper;
using CoBRAMVC4Portal.CustomClasses.Mapping;

namespace CoBRAMVC4Portal.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index()
        {
        }
    }
}
