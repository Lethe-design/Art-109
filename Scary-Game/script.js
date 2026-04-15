// Replaced/expanded script to add multiple narrative steps and branching
(function(){
  const page = document.body.id;

  function tryPlay(audio, vol = 1){
    if(!audio) return;
    audio.volume = vol;
    audio.currentTime = 0;
    const p = audio.play();
    if(p && p.catch) p.catch(()=>{});
  }

  const goodChoiceSounds = [
    'assets/sounds/good1.mp3',
    'assets/sounds/good2.mp3',
    'assets/sounds/good3.mp3',
    'assets/sounds/good4.mp3'
  ];
  const badChoiceSounds = [
    'assets/sounds/bad1.mp3',
    'assets/sounds/bad2.mp3',
    'assets/sounds/bad3.mp3',
    'assets/sounds/bad4.mp3'
  ];

  function playChoiceTone(tone){
    const sources = tone === 'bad' ? badChoiceSounds : goodChoiceSounds;
    const audio = new Audio(sources[Math.floor(Math.random()*sources.length)]);
    tryPlay(audio, 1);
  }

  function getChoiceTone(choice){
    return choice.tone || 'good';
  }

  if(page === 'index'){
    const ambient = document.getElementById('ambient');
    const footsteps = document.getElementById('footsteps');
    const whisper = document.getElementById('whisper');
    const narrationLine = document.getElementById('line');
    const choicesEl = document.getElementById('choices');
    const sceneEl = document.querySelector('.scene');

    // longer gameplay: define a small state machine of scenes
    const scenes = {
      0: {
        text: "You step out into the evening — the park glows under lamp light and the forest waits at the edge. The air is cool, carrying the scent of earth and autumn leaves. You pause for a moment, deciding your path home.",
        bg: ['assets/images/park_mist.jpg','assets/images/park_lamps.jpg','assets/images/park_dusk.jpg'],
        choices: [
          { text: "Follow the lit park path home", next: 1 },
          { text: "Head into the forest path", next: 3 }
        ]
      },
      // Park branch — a calm longer path with more narrative
      1: {
        text: "You follow the warm lamps, breathing easy. Your pace quickens slightly as darkness creeps at the edges. A stray dog suddenly trots beside you, nudging your hand. The bench ahead looks inviting, and you notice a few people still lingering in the distance.",
        bg: ['assets/images/park_lamps.jpg'],
        sound: 'footsteps',
        showGif: false,
        choices: [
          { text: "Sit on the bench to rest", next: 2 },
          { text: "Keep walking home", next: 'good' }
        ]
      },
      2: {
        text: "You sit and the dog curls at your feet. A neighbor greets you warmly and sits nearby. They point out a shortcut through the adjacent gardens that they say leads safely home. It would cut your walk in half. The dog's warmth comforts you.",
        bg: ['assets/images/park_dusk.jpg'],
        sound: 'chime',
        choices: [
          { text: "Take the shortcut home (safe)", next: 'good' },
          { text: "Ignore it and wander a bit longer", next: 3 } // accidentally leads toward forest edge
        ]
      },

      // Forest branch — multiple steps to lengthen tension with more narrative depth
      3: {
        text: "You step off the lamps' reach. The temperature drops noticeably. The trees close around you like a living wall, and your footsteps sound hollow on the path. A whisper brushes past your ear — almost like someone calling your name, but not quite. Your heart rate picks up.",
        bg: ['assets/images/forest_edge.jpg','assets/images/park_mist.jpg'],
        sound: 'whisper',
        choices: [
          { text: "Call out: 'Who's there?'", next: 4 },
          { text: "Keep moving forward quietly", next: 5 }
        ]
      },
      4: {
        text: "Your voice echoes through the dark. A faint light flickers between trunks ahead — possibly a flashlight, possibly something else. Something moves in the periphery where the light doesn't quite reach. You feel watched.",
        bg: ['assets/images/forest_path.jpg'],
        sound: 'whisper',
        choices: [
          { text: "Approach the flicker cautiously", next: 6 },
          { text: "Retreat toward the park", next: 1 }
        ]
      },
      5: {
        text: "You hurry along the narrow trail, trying to remain calm. Branches scrape your jacket and pull at your sleeves. You catch a glimpse of a figure standing motionless by a fallen log. It doesn't react to your presence. The silence is deafening.",
        bg: ['assets/images/forest_deep.jpg'],
        sound: 'footsteps',
        choices: [
          { text: "Investigate the figure", next: 6 },
          { text: "Run back to the lamps", next: 'good' }
        ]
      },
      6: {
        text: "The figure turns slowly toward you. In the darkness, you can't make out its features clearly. Your heartbeat quickens. A distant sound echoes through the trees — could be wind, could be something else. The path ahead splits dramatically: one way is lit by a strange blue bioluminescent glow, the other is swallowed completely by black.",
        bg: ['assets/images/forest_fork.jpg'],
        sound: 'bad1',
        showGif: true,
        gif: 'assets/gif/fly_gif.gif',
        gifAlt: 'the figure before you',
        gotoOnClick: 'unknown.html',
        choices: [
          { text: "Follow the blue glow (uncertain)", next: 7 },
          { text: "Follow the black path (curiosity)", next: 8, tone: 'bad' }
        ]
      },
      7: {
        text: "You hesitate, then push toward the blue light. The glow intensifies with each step, becoming almost blinding. You shield your eyes. Behind you, the figure has vanished. Ahead, you see a break in the trees — lights from town beyond. The strange blue glow was just bioluminescent fungi. You've found your way out.",
        bg: ['assets/images/park_lamps.jpg'],
        sound: 'chime',
        choices: [
          { text: "Emerge to safety", next: 'good' }
        ]
      },
      8: {
        text: "Against your better judgment, you step into the void. Behind you, the blue light fades. The darkness is absolute now. Your breath comes faster. The figure follows. The whispers grow louder, and you realize they form words — ancient, incomprehensible, pulling at the edges of your sanity. There is no way back.",
        bg: ['assets/images/forest_deep.jpg'],
        sound: 'whisper',
        choices: [
          { text: "Accept what comes", next: 'bad', tone: 'bad' }
        ]
      }
    };

    // pick a randomized start background
    function setBackground(variants){
      const pick = Array.isArray(variants) ? variants[Math.floor(Math.random()*variants.length)] : variants;
      if(pick) sceneEl.style.backgroundImage = `url("${pick}")`;
    }

    let current = 0;
    let typingTimer = null;

    function showScene(id){
      const s = scenes[id];
      if(!s) return;
      // update background and play any designated sound
      setBackground(s.bg);
      if(s.sound === 'whisper') tryPlay(whisper, 0.9);
      if(s.sound === 'footsteps') tryPlay(footsteps, 0.8);
      if(s.sound === 'chime') tryPlay(document.getElementById('chime') || new Audio('assets/sounds/chime.mp3'), 0.7);
      if(s.sound === 'bad1') tryPlay(new Audio('assets/sounds/bad1.mp3'), 0.9);

      // handle gif display
      const gifContainer = document.getElementById('gifContainer');
      if(s.showGif && gifContainer) {
        gifContainer.style.display = 'block';
        const gifImg = document.getElementById('narrativeGif');
        if(gifImg && s.gif) {
          gifImg.src = s.gif;
          gifImg.alt = s.gifAlt || 'narrative element';
          // remove existing click handlers
          gifImg.onclick = null;
          // add click handler if gotoOnClick is defined
          if(s.gotoOnClick) {
            gifImg.style.cursor = 'pointer';
            gifImg.onclick = () => {
              window.location.href = s.gotoOnClick;
            };
          }
        }
      } else if(gifContainer) {
        gifContainer.style.display = 'none';
      }

      // reveal text with simple type effect
      const full = s.text;
      narrationLine.textContent = "";
      choicesEl.setAttribute('aria-hidden','true');
      choicesEl.innerHTML = "";
      let i = 0;
      clearInterval(typingTimer);
      typingTimer = setInterval(()=> {
        narrationLine.textContent += full[i++] || '';
        if(i >= full.length) {
          clearInterval(typingTimer);
          renderChoices(s.choices);
        }
      }, 18);
    }

    function renderChoices(list){
      choicesEl.setAttribute('aria-hidden','false');
      choicesEl.innerHTML = "";
      list.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'choice';
        if(c.text.toLowerCase().includes('run') || c.text.toLowerCase().includes('curiosity') || c.text.toLowerCase().includes('investigate')) btn.classList.add('danger');
        btn.textContent = c.text;
        btn.addEventListener('click', ()=> handleChoice(c.next, getChoiceTone(c)));
        choicesEl.appendChild(btn);
      });
    }

    function handleChoice(next, tone){
      // play a short thematic cue based on whether this choice is good/neutral or bad
      playChoiceTone(tone);
      tryPlay(footsteps, 0.9);

      if(next === 'good' || next === 'bad'){
        // brief delay to build tension before end page
        setTimeout(()=> {
          // play short sounds before leaving
          if(next === 'good'){
            const chime = new Audio('assets/sounds/chime.mp3');
            tryPlay(chime, 1);
            setTimeout(()=> window.location.href = 'good.html', 900);
          } else {
            const j = new Audio('assets/sounds/jump_scare.mp3');
            tryPlay(whisper, 1);
            setTimeout(()=> { tryPlay(j, 1); window.location.href = 'bad.html'; }, 900);
          }
        }, 700);
        return;
      }

      // otherwise transition to next scene id
      current = next;
      // small pause and a breath before next narration
      choicesEl.setAttribute('aria-hidden','true');
      setTimeout(()=> showScene(current), 600);
    }

    function startGame(){
      tryPlay(ambient, 0.5);
      tryPlay(footsteps, 0.6);
      // show initial scene after tiny pause
      setTimeout(()=> showScene(0), 350);
    }

    // initialize with randomized starting background
    setBackground(scenes[0].bg);
    // immediately start playthrough when arriving from start page
    startGame();
  }

  // good / bad pages unchanged but keep small resume behavior (existing code)
  else if(page === 'good'){
    const resume = document.getElementById('resumeOverlay');
    const resumeBtn = document.getElementById('resumeBtn');
    const chime = document.getElementById('chime');
    const goodAmb = document.getElementById('goodAmb');
    const goodEndAudio = document.getElementById('GoodEndAudio');
    if(resumeBtn){
      resumeBtn.addEventListener('click', ()=>{
        resume.style.display = 'none';
        tryPlay(chime);
        tryPlay(goodEndAudio);
        tryPlay(goodAmb);
      });
      resume.addEventListener('click',(e)=>{ if(e.target===resume) { resumeBtn.click(); }});
    }
  } else if(page === 'bad'){
    const resume = document.getElementById('resumeOverlay');
    const resumeBtn = document.getElementById('resumeBtn');
    const jump = document.getElementById('jump');
    const badAmb = document.getElementById('badAmb');
    const badEndAudio = document.getElementById('BadEndAudio');
    const endScene = document.getElementById('endScene');
    const jumpScare = document.getElementById('jumpScare');
    if(jumpScare){
      jumpScare.addEventListener('click', ()=>{
        jumpScare.style.display = 'none';
      });
    }
    if(resumeBtn){
      resumeBtn.addEventListener('click', ()=>{
        resume.style.display = 'none';
        tryPlay(badAmb);
        setTimeout(()=> {
          tryPlay(jump);
          tryPlay(badEndAudio);
          if(jumpScare) jumpScare.style.display = 'block';
          if(endScene) endScene.classList.add('flash');
        }, 900);
      });
      resume.addEventListener('click',(e)=>{ if(e.target===resume) { resumeBtn.click(); }});
    }
  }

})();