using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ArinsSite.Helpers
{
    public static class RenderAsJObjectHelper
    {
        public static string RenderAsJObject(this HtmlHelper html, object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

    }
}
