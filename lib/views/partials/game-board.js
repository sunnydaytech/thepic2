function GameBoard(canvasEl) {
  this.canvasEl = canvasEl;
  this.DIR = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  this.blockNum = 3;
  this.emptyRow = 0; //Math.floor(Math.random() * this.blockNum);
  this.emptyCol = 0; //Math.floor(Math.random() * this.blockNum);
  this.blocks = [];
  this.imageId = canvasEl.getAttribute('imageId');
  this.imageSize = canvasEl.offsetWidth;
  this.imageUrl = this.getResizeImageUrl_(this.imageId, this.imageSize);
  this.seed_ = 0;
  for (var i = 0; i < this.imageId.length; i++) {
    this.seed_ += this.imageId.charCodeAt(i);
  }
};

GameBoard.prototype.drawCanvas = function() {
  var canvasEl = this.canvasEl,
      emptyCol = this.emptyCol,
      emptyRow = this.emptyRow,
      blockNum = this.blockNum,
      blocks = this.blocks;

  canvasEl.style.height = this.imageSize + 'px';
  canvasEl.style.width = this.imageSize + 'px';
  var perBlockSize = this.imageSize / blockNum;

  for (var i = 0; i < blockNum; i++) {
    blocks.push([]);
    for (var j = 0; j < blockNum; j++) {
      var blockEl = document.createElement("div");
      var r = i;
      var c = j;
      //if (i !=  emptyRow || j != emptyCol) {
        blockEl.style.backgroundImage = 'url(' + this.imageUrl + ')';
        blockEl.style.backgroundPosition = -c * perBlockSize + 'px ' + (-r * perBlockSize) + 'px';
      //} else {
      //  blockEl.classList.add('empty');
      // }
      blockEl.classList.add('block');
      blockEl.style.top = i * perBlockSize + 'px';
      blockEl.style.left = j * perBlockSize + 'px';
      blockEl.style.height = perBlockSize + 'px';
      blockEl.style.width = perBlockSize + 'px';
      blockEl.setAttribute('r', r)
      blockEl.setAttribute('c', c);
      canvasEl.appendChild(blockEl);
      blocks[i].push(blockEl);
    }
  }
};

GameBoard.prototype.showFullImage = function() {
  while (this.canvasEl.hasChildNodes()) {
    this.canvasEl.removeChild(canvasEl.lastChild)
  }
  this.canvasEl.style.backgroundImage = 'url(' + this.imageUrl + ')';
};



GameBoard.prototype.isGameOver = function() {
  for (var i = 0; i < this.blockNum; i++) {
    for (var j = 0; j < this.blockNum; j++) {
      if (this.blocks[i][j].getAttribute('r') != i ||
          this.blocks[i][j].getAttribute('c') != j) {
        return false;
      }
    }
  }
  return true;
};

GameBoard.prototype.disorder = function() {
  var ret = 0;
  for (var i = 0; i < this.blockNum; i++) {
    for (var j = 0; j < this.blockNum; j++) {
      if (this.blocks[i][j].getAttribute('r') != i ||
          this.blocks[i][j].getAttribute('c') != j) {
        ret++;
      }
    }
  }
  return ret;
};



GameBoard.prototype.shuffle = function(count, delay, done) {

  setTimeout(function() {
    var emptyBlock = this.blocks[this.emptyRow][this.emptyCol];
    emptyBlock.style.backgroundImage = '';
    emptyBlock.classList.add('empty');
    this.shuffle_(count, 100, done);
  }.bind(this), delay);
};

GameBoard.prototype.shuffle_ = function(count, delay, done) {
  setTimeout(function() {
    if (count <= 0) {
      done();
    } else {
      this.move(this.randomDir_());
      if (this.disorder() >= 8) {
        this.shuffle_(count/2, delay, done);
      } else {
        this.shuffle_(count-1, delay/1.01, done);
      }
    }
  }.bind(this), delay);
};

GameBoard.prototype.randomDir_ = function() {
  return this.random_(4);
}

GameBoard.prototype.random_ = function(n) {
  return Math.floor(Math.random() * n);
};

// Repeatable random.
GameBoard.prototype.seededRandom_ = function(min, max) {
    max = max || 1;
    min = min || 0;
 
    this.seed_ = (this.seed_ * 9301 + 49297) % 233280;
    var rnd = this.seed_ / 233280;
 
    return min + rnd * (max - min);
}

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

