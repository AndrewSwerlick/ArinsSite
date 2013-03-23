using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ArinsSite.Helpers
{
    public static class RandomNumberHelper
    {
        private static Random _rand = new Random();
        public static int RandomNumber(this HtmlHelper helper, int lowValue, int highValue)
        {
            return _rand.Next(lowValue, highValue);
        }
    }
}