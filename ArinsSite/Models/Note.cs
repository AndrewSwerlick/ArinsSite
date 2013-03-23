using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ArinsSite.Models
{
    public class Note
    {
        [Key]
        public Guid Id { get; set; }
        public double LocationX { get; set; }
        public double LocationY { get; set; }
        public string Text { get; set; }
        public User Author {get;private set;}
        public DateTime Created { get; private set; }

        public Note()
        {
            Created = DateTime.Now;
        }
    }
}