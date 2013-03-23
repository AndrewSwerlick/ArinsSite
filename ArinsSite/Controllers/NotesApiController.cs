using ArinsSite.Infrastructure;
using ArinsSite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ArinsSite.Controllers
{
    public class NotesApiController : ApiController
    {
        DataContext context = new DataContext();

        public IEnumerable<Note> Get()
        {
            return context.Notes;
        }
    }
}
