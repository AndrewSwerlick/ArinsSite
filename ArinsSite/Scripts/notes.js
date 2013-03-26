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
Notes.directive('randomRotate', function () {
    return function (scope, element, attrs) {
        var rotation = Math.floor((Math.random() * 10)) - 5;
        element.css("-webkit-transform", "rotate(" + rotation + "deg)");
    }
});
Notes.directive('moveable', function () {
    return function (scope, element, attrs) {
        var options = scope.$eval(attrs.moveable);
        var dragElement = element.find(options.dragElement);
        var xStart = 0;
        var yStart = 0;
        var startPos;
        var move = function (e) {
            currentPos = {};
            currentPos.top = startPos.top + e.pageY - yStart;
            currentPos.left = startPos.left + e.pageX - xStart;
            element.css(currentPos);
        }
        dragElement.mousedown(function (e) {            
            xStart = e.pageX;
            yStart = e.pageY;
            startPos = element.position();
            element.mousemove(move);
        });
        dragElement.mouseup(function (e) {
            element.unbind('mousemove', move);
            currentPos = {};
            currentPos.top = startPos.top + e.pageY - yStart;
            currentPos.left = startPos.left + e.pageX - xStart;
            scope[options.moved](currentPos);
        });
    }
});
Notes.directive('zFocus', function () {
    return function (scope, element, attrs) {
        var events = attrs.zFocus;
        var focusEvent = events.split(',')[0];
        var resetEvent = events.split(',')[1];
        var currentz = element.css("z-index");
        element.on(focusEvent, function () {
            element.css("z-index", "99");
        });
        element.on(resetEvent, function () {
            element.css("z-index", currentz);
        });
    }
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
                    note.LocationX = updatedNote.LocationX;
                    note.LocationY = updatedNote.LocationY;
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

    $scope.noteMoved = function (newPos) {
        var note = $scope.notes[$scope.$index];
        note.LocationY = newPos.top;
        note.LocationX = newPos.left;
        notesHub.server.updateNote(note);
    }
}