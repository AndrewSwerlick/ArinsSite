using ArinsSite.Infrastructure;
using ArinsSite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ArinsSite.Controllers
{
    public class NotesController : Controller
    {
        DataContext context = new DataContext();

        //
        // GET: /Notes/

        public ActionResult Index()
        {
            return View(context.Notes.ToList());
        }

        [HttpPut]
        public ActionResult Add(Note note)
        {
            context.Notes.Add(note);
            context.SaveChanges();
            return Json(note);
        }

    }
}
