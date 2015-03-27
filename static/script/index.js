(
 window.onload = function() {
  var getResizeImageUrl = function(originalImageUrl, size) {
   return 'http://proxy.boxresizer.com/convert?resize=' + size + 'x' + size + '&source=' + originalImageUrl;
  };

  var move = function(direction) {
    console.log('Moving ' + direction);
  };

  var originalImageUrl = "http://www.rolereboot.org/wp-content/uploads/2014/08/Stephanie-Hello-Kitty-471x420.gif";
  var canvasEl = document.getElementById("canvas");
  var imageSize = 600;
  var imageUrl = getResizeImageUrl(originalImageUrl, imageSize);
  var blockNum = 3;
  var perBlockSize = imageSize / blockNum;
  for (var i = 0; i < 3; i++) {
    var rowEl = document.createElement('div');
    rowEl.className = 'row';
    for (var j = 0; j < 3; j++) {
      var blockEl = document.createElement("div");
      blockEl.className = 'block';
      blockEl.style.backgroundImage = 'url(' + imageUrl + ')';
      blockEl.style.backgroundPosition = -j * perBlockSize + 'px ' + (-i * perBlockSize) + 'px';
      blockEl.style.height = perBlockSize + 'px';
      blockEl.style.width = perBlockSize + 'px';
      rowEl.appendChild(blockEl);
    }
    canvasEl.appendChild(rowEl);
  }

  var inputManager = new KeyboardInputManager();
  inputManager.on('move', move.bind(this))
});
