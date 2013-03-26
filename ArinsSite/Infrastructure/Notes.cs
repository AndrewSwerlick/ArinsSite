using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using ArinsSite.Models;

namespace ArinsSite.Infrastructure
{
    public class Notes : Hub
    {
        DataContext context = new DataContext();

        public void Hello()
        {
            Clients.All.hello();
        }

        public void AddNote(Note note)
        {
            note.Id = Guid.NewGuid();
            context.Notes.Add(note);
            context.SaveChanges();
            Clients.All.newNoteAdded(note);
        }

        public void UpdateNote(Note note)
        {
            if (note == null)
                return;
            var existingNote = context.Notes.Find(note.Id);
            existingNote.Text = note.Text;
            existingNote.LocationX = note.LocationX;
            existingNote.LocationY = note.LocationY;
            context.SaveChanges();
            Clients.Others.noteUpdated(note);
        }

        public void DeleteNote(Note note)
        {
            if (note == null)
                return;
            var existingNote = context.Notes.Find(note.Id);
            context.Notes.Remove(existingNote);
            context.SaveChanges();
            Clients.All.noteDeleted(note);
        }
    }
}