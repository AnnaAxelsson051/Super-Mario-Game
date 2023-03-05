
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
const ENEMY_SPEED = 27

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

loadSprite('blue-block', 'fVscIbn.png')
loadSprite('blue-brick', '3e5YRQd.png')
loadSprite('blue-steel', 'gqVoI2b.png')
loadSprite('blue-evil-shroom', 'SvV4ueD.png')
loadSprite('blue-surprise', 'RMqCc1G.png')

loadRoot('https://i.imgur.com/')
loadSprite('red-flower', 'lrflEvy.png')
loadSprite('white-flower', 'n5U4VgX.png')
loadSprite('blue-flower', '39XU7Rx.png')
loadSprite('flower-blue2', 'COaSI01.png')
loadSprite('flower-pink', 'h0wteY1.png')
loadSprite('flower-yellow2', '1ghgoNa.png')
loadSprite('flower-knopp', 'YZkRiAn.png')
loadSprite('flower-bukett', 'ERnrj3M.png')
loadSprite('flower-bukett2', 'kepwINJ.png')
loadSprite('branch', 'rq6F1hk.png')
loadSprite('cat', 'FbkqHBE.png')
loadSprite('grass-green', 'dITAwi7.png')
loadSprite('grass-blue', 'FpSh0nF.png')
loadSprite('grass-small', 'ZLRAmR8.png')
loadSprite('diamond-blue', '64cPg7H.png')
loadSprite('diamond-blue2', 'xSX5W9r.png')

/*
Rose
https://imgur.com/TUZVmWA
Gul blomma solros:
https://imgur.com/Otl6TuR
 */









scene("game", ({ level, score }) => {
  layers(['bg', 'obj', 'ui'], 'obj')

  //array of the maps
  const maps = [
    [
      //Level 1 Flowerlevel
     'H                                         ',
     'H  %              sss                     ',
     'H       =%=      HHHHH                    ',  
     'H                                         ',
     'H         r                               ',
     'H  ==x   === H           H*H              ',
     'H                =                        ',
     'H  s                    uuc               ',
     'H sH                    HHH           s   ',
     'H H  %    J*=%=%      w             =%=   ',
     'H                     H     J          %% ',
     'H                            -+           ',
     'uuuu       U^  ^    K u    s ()       kp  ',
     'H===============================    ======',
    ],

    [
      //level 2 Blue level
      '£                                        £',
      '£                                        £',
      '£           ££                !@@!       £',
      '£  @@  £                                 £',
      '£                  !@!@       uuuu       £',
      '£              uuu!          !!!!!!    @!£',
      '£  £££!        !!!!     ux               £',
      '£     x        !  !   xxx                £',
      '£                    x               xxxx£',
      '£        @@@@@b     x        x  x        £',
      '£                  x        $x  x        £',
      '£                        x  $x  x  x   -+£',
      '      UB  z z    z   zux x  $x  x  xuuu()£',
      '!!!x!!!!!!x!!!!!!!!!!!!! !  !!  !  !!!!!!!',
    ],
    [
      //Goombalevel
      //Level 1
      '                        %                                     ',
      '                                   %%                         ',
      '        %%*               H                                   ',  
      '                       HHHH                                   ',
      '                        HH        HHH       X%                ',
      '        HHHHH                    HHHHH  x                     ',
      '                =             X                 xxx           ',
      '                                                              ',
      '            Y     HHHH                     xx                 ',
      '    HX   %Xxxxx    HHHH    =H*H           x            =%=    ',
      '                           =                          H       ',
      '                                        x                   -+',
      '    r   ^wB^ ^                        x  uuuu   us      Ur  ()',
      '==========================x=====     x   HHHHH  xx   =========',
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
    'w': [sprite('white-flower'), 'white-flower', scale(0.4)],
    'B': [sprite('blue-flower'), 'blue-flower', scale(0.4)],
    'U': [sprite('flower-blue2'), 'flower-blue2', scale(0.4)],
    'Y': [sprite('flower-yellow2'), 'flower-yellow2', scale(0.4)],
    'o': [sprite('flower-knopp'), 'flower-knopp', scale(0.4)],
    'k': [sprite('flower-bukett2'), 'flower-bukett2', scale(0.4)],
    'K': [sprite('flower-bukett'), 'flower-bukett', scale(0.4)],
    'p': [sprite('flower-pink'), 'flower-pink', scale(0.4)],
    'y': [sprite('branch'), 'branch', scale(0.25)],

    'c': [sprite('cat'), 'cat', scale(0.5)],

    'g': [sprite('grass-green'), 'grass-green', scale(0.5)],
    'u': [sprite('grass-blue'), 'grass-blue', scale(0.4)],
    's': [sprite('grass-small'), 'grass-small', scale(0.5)],

    'd': [sprite('diamond-blue'), 'diamond-blue', scale(0.4)],
    '2': [sprite('diamond-blue2'), 'diamond-blue2', scale(0.4)],
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

    //Blue level
    '!': [sprite('blue-block'), solid(), scale(0.5)],
    '£': [sprite('blue-brick'), solid(), scale(0.5)],
    'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous',body()],
    '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
    'b': [sprite('blue-surprise'), solid(), scale(0.5), 'mushroom-surprise'],
    'x': [sprite('blue-steel'), solid(), scale(0.5)],

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
/*
  //mushroom movement
  action('mushroom', (m) => {
    m.move(18, 0)
  })*/

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
      gameLevel.spawn('Y', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    if (obj.is('evil-shroom-surprise')) {
      gameLevel.spawn('^', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    if (obj.is('blue-evil-shroom-surprise')) {
      gameLevel.spawn('z', obj.gridPos.sub(0, 1))
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

/*
  action('dangerous', (d) => {      
    d.move(-ENEMY_SPEED, 0)
  })*/

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

/*
  player.collides('pipe', () => {
    keyPress('down', () => {
      go('game', {
        level: (level + 1) % maps.length,
        score: scoreLabel.value
      })
    })
  })*/
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
