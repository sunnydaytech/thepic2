function GameBoard(canvasEl) {
  this.canvasEl = canvasEl;
  this.DIR = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  this.blockNum = 3;
  this.emptyRow = 0; //Math.floor(Math.random() * this.blockNum);
  this.emptyCol = 0; //Math.floor(Math.random() * this.blockNum);
  this.blocks = [];
};

GameBoard.prototype.drawCanvas = function() {
  var canvasEl = this.canvasEl,
      emptyCol = this.emptyCol,
      emptyRow = this.emptyRow,
      blockNum = this.blockNum,
      blocks = this.blocks;

  var imageId = canvasEl.getAttribute('imageId');
  var imageSize = canvasEl.offsetWidth;
  canvasEl.style.height = imageSize + 'px';
  canvasEl.style.width = imageSize + 'px';
  var imageUrl = this.getResizeImageUrl_(imageId, imageSize);
  var perBlockSize = imageSize / blockNum;
  var shuffle = [];
  for (var i = 0; i < blockNum; i++) {
    shuffle.push([]);
    for (var j = 0; j < blockNum; j++) {
      shuffle[i].push({r: i, c: j});
    }
  }

  for (var i = 0; i < blockNum; i++) {
    blocks.push([]);
    for (var j = 0; j < blockNum; j++) {
      var blockEl = document.createElement("div");
      var r = shuffle[i][j].r;
      var c = shuffle[i][j].c;
      console.log(r + ':' + c)
      if (i !=  emptyRow || j != emptyCol) {
        blockEl.style.backgroundImage = 'url(' + imageUrl + ')';
        blockEl.style.backgroundPosition = -c * perBlockSize + 'px ' + (-r * perBlockSize) + 'px';
      } else {
        blockEl.classList.add('empty');
      }
      blockEl.classList.add('block');
      blockEl.style.top = i * perBlockSize + 'px';
      blockEl.style.left = j * perBlockSize + 'px';
      blockEl.style.height = perBlockSize + 'px';
      blockEl.style.width = perBlockSize + 'px';
      canvasEl.appendChild(blockEl);
      blocks[i].push(blockEl);
    }
  }
};

GameBoard.prototype.shuffle = function(count, delay, done) {
  var self = this;
  setTimeout(function() {
    self.move(self.randomDir_());
    count--;
    if (count > 0) {
      self.shuffle(count, delay/1.1, done);
    } else {
      done();
    }
  }, delay);
};

GameBoard.prototype.randomDir_ = function() {
  return this.random_(4);
}

GameBoard.prototype.random_ = function(n) {
  return Math.floor(Math.random() * n);
};

GameBoard.prototype.getResizeImageUrl_ = function(imageId, size) {
   return 'http://res.cloudinary.com/sunnydaytech/image/upload/c_fill,h_' + size + ',w_' + size + '/' + imageId;
};

GameBoard.prototype.randomPos_ = function(blockNum) {
  return {
    r: Math.floor(Math.random() * blockNum),
    c: Math.floor(Math.random() * blockNum),
  };
};

GameBoard.prototype.isInRange_ = function(x, N) {
  return x >= 0 && x < N;
};

GameBoard.prototype.move = function(direction) {
  var DIR = this.DIR, 
      blocks = this.blocks,
      blockNum = this.blockNum,
      emptyRow = this.emptyRow, 
      emptyCol = this.emptyCol;
  direction = (direction + 2) % 4;
  var newR = emptyRow + DIR[direction][0];
  var newC = emptyCol + DIR[direction][1];
  if (this.isInRange_(newR, blockNum) && this.isInRange_(newC, blockNum)) {
    console.log('new ' + newR + ':' + newC);

    var tmp = blocks[newR][newC].style.top;
    blocks[newR][newC].style.top = blocks[emptyRow][emptyCol].style.top;
    blocks[emptyRow][emptyCol].style.top = tmp;

    tmp = blocks[newR][newC].style.left;
    blocks[newR][newC].style.left = blocks[emptyRow][emptyCol].style.left;
    blocks[emptyRow][emptyCol].style.left = tmp;

    tmp = blocks[newR][newC];
    blocks[newR][newC] = blocks[emptyRow][emptyCol];
    blocks[emptyRow][emptyCol] = tmp;

    this.emptyRow = newR;
    this.emptyCol = newC;
  }
};

