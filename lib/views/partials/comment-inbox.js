(function() {
  var submitButton = document.getElementById('send-comment');
  console.log(submitButton);
  var commentForm = document.getElementById('comment-form');
  submitButton.onclick = function() {
    commentForm.submit();
  }
}());
