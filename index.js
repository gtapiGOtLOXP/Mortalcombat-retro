const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;
const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: canvas.height - 445
  },
  imageSrc: 'img/shop.png',
  scale: 2.75,
  framesMax: 6
})

// player init
const player = new Fighter({
  position: {
    x: 200,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/samuraiMack/Idle.png',
  scale: 2.5,
  framesMax: 8,
  offset: {
    x: 215,
    y: 155
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },
    attack2: {
      imageSrc: './img/samuraiMack/Attack2.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 120,
    height: 50
  }
});
// enemy init
const enemy = new Fighter({
  position: {
    x: 700,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0},
    imageSrc: './img/kenji/Idle.png',
    scale: 2.5,
    framesMax: 4,
    offset: {
      x: 215,
      y: 170
    },
    sprites: {
      idle: {
        imageSrc: './img/kenji/Idle.png',
        framesMax: 4
      },
      run: {
        imageSrc: './img/kenji/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/kenji/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/kenji/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/kenji/Attack1.png',
        framesMax: 4
      },
      attack2: {
        imageSrc: './img/kenji/Attack2.png',
        framesMax: 4
      }
    },
    attackBox: {
      offset: {
        x: -130,
        y: 50
      },
      width: 120,
      height: 50
    }
});


//Sprite controls
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  Space: {
    pressed: false
  },
  h: {
    pressed: false
  },

  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  },
  Backspace: {
    pressed: false
  },
  Enter: {
    pressed: false
  }

  
}


decreaseTimer()

if (player.position.x > enemy.position.x + enemy.width){
  console.log('yes')
} else if (player.position.x < enemy.position.x + enemy.width){
  console.log('no')
}

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update()
  shop.update()
  player.update();
  enemy.update();

  //player movement
  player.velocity.x = 0
  
 
  if (keys.a.pressed && player.lastKey === 'a' ){
    player.velocity.x = -5
    
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd'){
    player.velocity.x = 5
    
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  if (player.velocity.y < 0){
    player.switchSprite('jump')
  }

  if (player.velocity.y > 0){
    player.switchSprite('fall')
  }

  // enemy movement
  enemy.velocity.x = 0
  
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
    enemy.velocity.x = -5
    if (enemy.position.x + enemy.width < player.position.x){
      console.log('yes1')
    }
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  }  else {
    enemy.switchSprite('idle')
  }

  if (enemy.velocity.y < 0){
    enemy.switchSprite('jump')
  }

  if (enemy.velocity.y > 0){
    enemy.switchSprite('fall')
  }
  // player attack
  if (rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking1 && keys.Space.pressed) {
    player.isAttacking1 = false
    enemy.health -= 10
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }
  // enemy attack
  if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking1 && keys.Backspace.pressed) {
    enemy.isAttacking1 = false
    player.health -= 10
    document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  if (rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking2 && keys.h.pressed) {
    player.isAttacking2 = false
    enemy.health -= 20
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }
  // enemy attack
  if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking2 && keys.Enter.pressed) {
    enemy.isAttacking2 = false
    player.health -= 20
    document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerId})
  }
  

}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
    	break;
		case 'a':
			keys.a.pressed = true
      player.lastKey = 'a'
			break;
    case 'w':
      keys.w.pressed = true
      player.velocity.y = -20
      break;
    case ' ':
      keys.Space.pressed = true
      player.attack()
      break;
    case 'h':
      keys.h.pressed = true
      player.attack2()
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = true
      enemy.velocity.y = -20
      break; 
    case 'Backspace':
      keys.Backspace.pressed = true
      enemy.attack()
      break;
    case 'Enter':
      keys.Enter.pressed = true
      enemy.attack2()
      break;

  }
  console.log(event)
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
    	break;
		case 'a':
			keys.a.pressed = false
			break;
    case 'w':
      keys.w.pressed = false
      break;
    case 'Space':
      keys.Space.pressed = false
      break;
    case 'h':
      keys.h.pressed = false
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      break;
    case 'Backspace':
      keys.Backspace.pressed = false
      
      break;
    case 'Enter':
      keys.Enter.pressed = false
      break;
  }

});

