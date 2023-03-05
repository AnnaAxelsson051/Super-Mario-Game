

//Initialize kaboom
kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  //size of game
  debug: true,
  clearColor: [0, 0, 0, 1],
})

// Speed identifiers
const MOVE_SPEED = 120
const JUMP_FORCE = 360
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
const FALL_DEATH = 400
const ENEMY_SPEED = 22

// Game logic

let isJumping = true

//https://imgur.com/a/F8Jkryq
//tre prickarna - copy - sista tecknen
loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
/**/ 
loadSprite('flower', 'uaUm9sN.png')
/**/ 
loadSprite('evil-shroom', 'KPO3fR9.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'M6rwarW.png')
loadSprite('mario', 'Wb1qfhK.png')
loadSprite('mushroom', '0wMd92p.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')

loadRoot('https://i.imgur.com/')
loadSprite('red-flower', 'lrflEvy.png')

scene("game", ({ level, score }) => {
  layers(['bg', 'obj', 'ui'], 'obj')

  //array of the maps
  const maps = [

   
    [
      //Level 1
     'H                                         ',
     'H       =%=                               ',  
     'H                                         ',
     'H         r                               ',
     'H        === H           H*H              ',
     'H                =                        ',
     'H                                         ',
     'H                       HHH               ',
     'H    %    J*=%=%      §             =%=   ',
     'H                     H                %% ',
     'H                            -+           ',
     '      §        § §^      ^ ^ ()       §   ',
     'H===============================    ======',
    ]
  ]

  //measurements for sprites
  //assign pics to signs
  const levelCfg = {
    width: 20,
    height: 20,
    //'r': [sprite('red-flower'), 'flower'],
    '=': [sprite('block'), solid()],
    'H': [sprite('brick'), solid()],
    '$': [sprite('coin'), 'coin'],
    '§': [sprite('flower'), 'flower'],
    /**/ 
    'r': [sprite('red-flower'), 'red-flower', scale(0.4)],
    /**/ 
    '%': [sprite('surprise'), solid(), 'coin-surprise'],
    '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
    /**/ 
    'J': [sprite('surprise'), solid(), 'flower-surprise'], 
    'X': [sprite('surprise'), solid() ,'evil-shroom-surprise'],
    'Z': [sprite('blue-surprise'), solid(),scale(0.5),'blue-evil-shroom-surprise'],
    /**/
    '}': [sprite('unboxed'), solid()],
    '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
    ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
    '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
    '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
    '^': [sprite('evil-shroom'), solid(), 'dangerous', body()],
    '#': [sprite('mushroom'), solid(), 'mushroom', body()],

  }

  //go into array get the first level and the config
  const gameLevel = addLevel(maps[level], levelCfg)

  //ui layer så det inte interfeares med ngt som sker i spelet 
  //displays score in top left corner
  const scoreLabel = add([
    text(score),
    pos(30, 6),
    layer('ui'),
    {
      value: score,
    }
  ])

  //increase gamelevel for each round start at lev 1
  add([text('Level ' + parseInt(level + 1) ), pos(40, 6)])
  
  /**************** PLAYER EATS MUSHROOM -GETS BIG ************** */

  function big() {
    let timer = 0
    let isBig = false
    return {
      update() {
        //if he is big = larger jump force
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
          timer -= dt()
          //dt = time since last frame
          if (timer <= 0) {
            //when timer ends = hes smaller again
            this.smallify()
          }
        }
      },

      //When player is big
      isBig() {
        return isBig
      },
      smallify() {
        this.scale = vec2(1)
        CURRENT_JUMP_FORCE = JUMP_FORCE
        timer = 0
        isBig = false
      },
      biggify(time) {
        this.scale = vec2(1.4)
        timer = time
        isBig = true     
      }
    }
  }

  /************ Applying FEATURES to main player ****************/

  const player = add([
    sprite('mario'), solid(),
    pos(30, 0),
    body(),
    big(),  //so he can get big if eats mushroom
    origin('bot')
  ])

  /***************** HEADBUMPING ******************/

  //When he headbumps boxes
  player.on("headbump", (obj) => {
    if (obj.is('coin-surprise')) {
      gameLevel.spawn('$', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    if (obj.is('mushroom-surprise')) {
      gameLevel.spawn('#', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    //flower surprise
    if (obj.is('flower-surprise')) {
      gameLevel.spawn('§', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
  })

  /********************* COLLIDING WITH OBJECTS /DEATH ******************** */

  //if he eats a mushroom hes big for 7sec
  player.collides('mushroom', (m) => {
    destroy(m)
    player.biggify(7)
  })

  player.collides('coin', (c) => {
    destroy(c)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })


  player.collides('dangerous', (d) => {
    if (isJumping) {
      //only destroy dangerous if he jumps on it
      destroy(d)
    } else {
      go('lose', { score: scoreLabel.value})
    }
  })

  player.collides('pipe', () => {
    keyPress('down', () => {
      go('game', {
        //go to next level
        level: (level + 1) % maps.length,
        //makes the levels loop
        score: scoreLabel.value
      })
    })
  })

  /*************** CAM FOLLOWS PLAYER / PLAYER FALLS ************* */

  player.action(() => {
    camPos(player.pos)
    //camera follows player
    if (player.pos.y >= FALL_DEATH) {
      go('lose', { score: scoreLabel.value})
      //go to loose scene and show score
    }
  })


  /******************* MUSHROOM MOVENEMNTS ************* */

  action('mushroom', (m) => {
    m.move(18, 0)
  })

  /****************** ENEMY MOVEMENTS **************** */

  action('dangerous', (d) => {      //enemy movenemnts
    d.move(-ENEMY_SPEED, 0)
  })

  /******************** PLAYER MOVEMENTS ******************* */

  //Eventlisteners for pLayer movements 
  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0)
  })

  keyDown('right', () => {
    player.move(MOVE_SPEED, 0)
  })

  //if is grounded isJumping is false
  player.action(() => {
    if(player.grounded()) {
      isJumping = false
    }
  })

  //if he is on ground he can jump
  keyPress('space', () => {
    if (player.grounded()) {
      isJumping = true
      player.jump(CURRENT_JUMP_FORCE)
    }
  })
})

/**************** STOP AND START GAME ***************** */

scene('lose', ({ score }) => {
  add([text(score, 32), origin('center'), pos(width()/2, height()/ 2)])
})

//start at level 0
start("game", { level: 0, score: 0})
