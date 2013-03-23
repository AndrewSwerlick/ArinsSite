var Notes = angular.module('Notes', ['ngResource']);
Notes.directive('contenteditable', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            // view -> model
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(elm.html());
                });
            });

            // model -> view
            ctrl.$render = function() {
                elm.html(ctrl.$viewValue);
            };
        }
    };
});
var notesHub = $.connection.notes;

function NotesCtrl($scope, $resource) {
    var noteService = $resource("/api/notesapi")
    window.scope = $scope;
    $scope.notes = []; 
    notesHub.client.newNoteAdded = function (note) {
        $scope.$apply(function () {
            $scope.notes.push(note);
        });
        $("[data-id=" + note.Id + "]").focus();
    }
    notesHub.client.noteUpdated = function (updatedNote) {
        for (noteInd in $scope.notes) {
            var note = $scope.notes[noteInd];
            if (note.Id == updatedNote.Id)
                $scope.$apply(function () {
                    note.Text = updatedNote.Text;
                });
        }
    }
    notesHub.client.noteDeleted = function (deletedNote) {
        for (noteInd in $scope.notes) {
            var note = $scope.notes[noteInd];
            if (note.Id == deletedNote.Id)
                $scope.$apply(function () {
                    $scope.notes.splice(noteInd, 1);
                });
        }
    }

    $.connection.hub.start().done(function () {
        $("#noteBoard").click(function (e) {
            if (e.srcElement != this)
                return;
            var note = {
                "LocationX": e.offsetX,
                "LocationY" : e.offsetY
            };
            notesHub.server.addNote(note);
        });            
    });

    var notes = noteService.query(function () {
        $scope.notes = notes;
    });
};

function NotesItemCtrl($scope) {
    $scope.$watch('notes[$index]',
        function (newval, oldval, scope) {
            if(newval.Text != oldval.Text)
                notesHub.server.updateNote($scope.notes[$scope.$index]);
        }, true);

    $scope.deleteNoteClicked = function (event) {
        notesHub.server.deleteNote($scope.notes[$scope.$index]);
    };
    $scope.noteClicked = function (event) {
        $(event.srcElement.parentElement).css("z-index","99");
    }
}