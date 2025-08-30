document.addEventListener('DOMContentLoaded', () => {
    
    //======================================================================
    // 1. SELECTORES Y DATOS
    //======================================================================
    const desktop = document.getElementById('desktop');
    let highestZIndex = 1;

    const desktopFiles = {
        'about-me': {
            title: 'About_Jhael_Baez.txt', type: 'text',
            content: `
                <div class="about-me-container">
                    <div class="profile-pic-container">
                        <img src="assets/images/Profile.jpg" alt="Foto de perfil" class="profile-pic">
                    </div>
                    <div class="about-me-content">
                        <h1>Jhael Baez</h1>
                        <p>'Creativo' y apasionado por el diseño digital, 3D y tecnología. Transformo conceptos en proyectos visuales atractivos.</p>
                        <h3>// CONECTAR</h3>
                        <p>> GitHub: <a href="#" target="_blank">HDD.EXE</a> | Instagram: <a href="https://www.instagram.com/champanasdepapi/" target="_blank">@champanasdepapi</a><br>> LinkedIn: <a href="https://www.linkedin.com/in/jhaelbaez/" target="_blank">Jhael Baez</a> | YouTube: <a href="https://www.youtube.com/@KBOARDDOT007" target="_blank">KBOARDDOT</a></p>
                    </div>
                </div><hr><h3>// HABILIDADES</h3>
                <div class="skill-item"><span class="skill-name text-blue">Illustrator.exe</span><div class="skill-bar-container"><div class="skill-bar-level" style="width: 80%;"></div></div></div>
                <div class="skill-item"><span class="skill-name text-red">Adobe Premiere</span><div class="skill-bar-container"><div class="skill-bar-level" style="width: 100%;"></div></div></div>
                <div class="skill-item"><span class="skill-name text-blue">Photoshop.exe</span><div class="skill-bar-container"><div class="skill-bar-level" style="width: 90%;"></div></div></div>
                <div class="skill-item"><span class="skill-name text-blue">Lightroom.exe</span><div class="skill-bar-container"><div class="skill-bar-level" style="width: 90%;"></div></div></div>
                <div class="skill-item"><span class="skill-name text-red">After Effects</span><div class="skill-bar-container"><div class="skill-bar-level" style="width: 70%;"></div></div></div>
                <div class="skill-item"><span class="skill-name text-red">Davinci Resolve</span><div class="skill-bar-container"><div class="skill-bar-level" style="width: 50%;"></div></div></div>
                <div class="skill-item"><span class="skill-name">Blender</span><div class="skill-bar-container"><div class="skill-bar-level" style="width: 70%;"></div></div></div>
                <div class="skill-item"><span class="skill-name">HTML</span><div class="skill-bar-container"><div class="skill-bar-level" style="width: 90%;"></div></div></div>
                <div class="skill-item"><span class="skill-name">CSS</span><div class="skill-bar-container"><div class="skill-bar-level" style="width: 80%;"></div></div></div>
                <div class="skill-item"><span class="skill-name">JavaScript</span><div class="skill-bar-container"><div class="skill-bar-level" style="width: 50%;"></div></div></div>`
        },
        'game': { title: 'BrickBreaker.exe', type: 'game' },
        'terminal':{title:'Terminal',type:'text',content:"<p>System Shell v1.0... By > HDD.EXE 2025 Copyright</p>"},
        'photos':{title:'Directory: /Photos',type:'folder',content:[{name:'Signature.png',type:'image',url:'assets/images/Signature.png',description:'Sauce League.<br>Toma Nocturna.',metadata:{camera:'Sony ILCE-6000<br>Punto F f/5.6<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/100s'}},
            {name:'b&w_Kyrie_son.jpg',type:'image',url:'assets/images/b&w_kyrie_son.jpg',description:'Jeremy Devers<br>#11 Team Mojica',metadata:{camera:'Sony ILCE-6000<br>Punto F f/5.6<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/100s'}},
            {name:'Cross_kyrie_son.jpg',type:'image',url:'assets/images/Cross_kyrie_son.jpg',description:'Jeremy Devers<br>CrossOver',metadata:{camera:'Sony ILCE-6000<br>Punto F f/5.6<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/150s'}},
            {name:'Fault_ar.jpg',type:'image',url:'assets/images/Fault_ar.jpg',description:'Jose Valdez<br>Tiro_libre',metadata:{camera:'Sony ILCE-6000<br>Punto F f/5.6<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/150s'}},
            {name:'kinki_stop!.jpg',type:'image',url:'assets/images/kinki_stop!.jpg',description:'Hector Tapia<br>superMan',metadata:{camera:'Sony ILCE-6000<br>Punto F f/5.6<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/150s'}},
            {name:'kinki_timeStop.jpg',type:'image',url:'assets/images/kinki_timeStop.jpg',description:'Hector Tapia<br>In_the-Matrix',metadata:{camera:'Sony ILCE-6000<br>Punto F f/5.6<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/150s'}},
            {name:'Speed_ar.jpg',type:'image',url:'assets/images/Speed_ar.jpg',description:'Jose Valdez<br>Barry_allen',metadata:{camera:'Sony ILCE-6000<br>Punto F f/5.6<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/150s'}},
            {name:'the_big_3',type:'image',url:'assets/images/the_big_3.jpg',description:'Team Mojica<br>the_big_3',metadata:{camera:'Sony ILCE-6000<br>Punto F f/5.6<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/150s'}},
            {name:'Borissova_portrait_1',type:'image',url:'assets/images/Borissova_portrait_1.jpg',description:'Borissova<br>Portrait',metadata:{camera:'Sony ILCE-6000<br>Punto F f/5.6<br>ISO-125<br>Distancia Focal 55mm<br>Exposicion 1/160s'}},
            {name:'Borissova_portrait_2',type:'image',url:'assets/images/Borissova_portrait_2.jpg',description:'Borissova<br>Portrait_Sea',metadata:{camera:'Sony ILCE-6000<br>Punto F f/4.5<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/640s'}},
            {name:'Borissova_portrait_3',type:'image',url:'assets/images/Borissova_portrait_3.jpg',description:'Borissova<br>Portrait_Sea',metadata:{camera:'Sony ILCE-6000<br>Punto F f/4.5<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/640s'}},
            {name:'Borissova_portrait_4',type:'image',url:'assets/images/Borissova_portrait_4.jpg',description:'Borissova<br>Portrait_Sea',metadata:{camera:'Sony ILCE-6000<br>Punto F f/4.5<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/640s'}},
            {name:'Borissova_portrait_5',type:'image',url:'assets/images/Borissova_portrait_5.jpg',description:'Borissova<br>Portrait_Sea',metadata:{camera:'Sony ILCE-6000<br>Punto F f/4.5<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/640s'}},
            {name:'Borissova_portrait_6',type:'image',url:'assets/images/Borissova_portrait_6.jpg',description:'Borissova<br>Portrait_Sea',metadata:{camera:'Sony ILCE-6000<br>Punto F f/4.5<br>ISO-800<br>Distancia Focal 55mm<br>Exposicion 1/640s'}},
        
        ]},
            'videos':{title:'Directory: /Videos',type:'folder',content:[{name:'BigBuckBunny.mp4',type:'video',url:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}]},
            "3d-models":{title:'Directory: /3D_Models',type:'folder',content:[{name:'Astronaut.glb',type:'3d',url:'https://modelviewer.dev/shared-assets/models/Astronaut.glb'}]},
            'designs':{title:'Directory: /Designs',type:'folder',content:[{name:'Placeholder_Design.png',type:'image',url:'https://images.unsplash.com/photo-1629429408209-1f9129f1db17',description:'Identidad visual.',metadata:{software:'Illustrator'}}]},
            'contact':{title:'contact.sh',type:'text',content:'<h2>// COMUNICACIÓN</h2><p>> Email: <a href="mailto:jhaelbaez01@gmail.com">jhaelbaez01@gmail.com</a></p>'}
    };

    //======================================================================
    // 2. LÓGICA DE BIENVENIDA, SONIDO Y RELOJ
    //======================================================================
    const welcomeScreen=document.getElementById("welcome-screen"),terminalOutput=document.getElementById("terminal-output"),terminalInput=document.getElementById("terminal-input"),welcomeLines=["INITIATING CONNECTION...","BYPASSING SECURITY...","CONNECTION ESTABLISHED.","WELCOME, USER."];
    const typingSound = new Audio("assets/sounds/type.mp3");
    typingSound.loop = true;

    function typeWriter(){let e=0,t=0;typingSound.play().catch(e=>{});const n=()=>{if(e<welcomeLines.length){if(t<welcomeLines[e].length)terminalOutput.innerHTML+=welcomeLines[e].charAt(t++),setTimeout(n,50);else{terminalOutput.innerHTML+="\n",e++,t=0,setTimeout(n,300)}}else{terminalInput.style.display="block",typingSound.pause()}};n()}
    function startPortfolio(){playSound('assets/sounds/boot.mp3');welcomeScreen.classList.add("hidden");setTimeout(()=>{welcomeScreen.style.display="none",desktop.style.display="flex",requestAnimationFrame(()=>desktop.classList.add("visible"))},1e3)}
    function updateClock(){const e=new Date,t=String(e.getHours()).padStart(2,"0"),n=String(e.getMinutes()).padStart(2,"0");document.getElementById("clock").textContent=`${t}:${n}`}
    function playSound(src) { new Audio(src).play().catch(e => {}); }

    //======================================================================
    // 3. LÓGICA DEL JUEGO BRICK BREAKER (MEJORADO)
    //======================================================================
    function initBrickBreaker(canvas, windowDiv) { /* ... (Toda la lógica del juego mejorado) ... */ 
        const ctx = canvas.getContext('2d');
        let rightPressed = false, leftPressed = false, score = 0, lives = 3, level = 0, gameState = 'start';
        const levels = [
            [[1,1,1,1,1,1,1],[1,2,1,0,1,2,1],[1,1,1,1,1,1,1],[0,1,2,1,2,1,0],[0,0,1,1,1,0,0]],
            [[2,2,2,0,2,2,2],[2,1,1,1,1,1,2],[0,1,3,3,3,1,0],[0,1,1,1,1,1,0],[2,2,0,0,0,2,2]],
            [[3,3,3,3,3,3,3],[3,1,2,1,2,1,3],[3,2,1,1,1,2,3],[3,1,2,1,2,1,3],[3,3,3,3,3,3,3]]
        ];
        let balls = [], powerUps = [];
        const paddle = { height: 10, width: 80, x: (canvas.width - 80) / 2 };
        const brick = { rowCount: 5, columnCount: 7, width: 55, height: 20, padding: 5, offsetTop: 30, offsetLeft: 30 };
        let bricks = [];

        function createBall(x, y){ balls.push({ x: x, y: y, radius: 7, dx: 3.5, dy: -3.5 }); }
        function createPowerUp(x, y){ const types=['wide','multi']; powerUps.push({x:x, y:y, width:15, height:15, type: types[Math.floor(Math.random()*types.length)], dy: 2}); }
        
        const keyDownHandler=(e)=>{if(e.key==='d'||e.key==='ArrowRight')rightPressed=true;else if(e.key==='a'||e.key==='ArrowLeft')leftPressed=true;if(gameState!=='playing'&&e.key==='Enter'){score=0;lives=3;level=0;buildLevel();resetLevel();gameState='playing'}};
        const keyUpHandler=(e)=>{if(e.key==='d'||e.key==='ArrowRight')rightPressed=false;else if(e.key==='a'||e.key==='ArrowLeft')leftPressed=false};
        document.addEventListener('keydown', keyDownHandler); document.addEventListener('keyup', keyUpHandler);
        windowDiv.querySelector('.close-btn').addEventListener('click', () => { document.removeEventListener('keydown', keyDownHandler); document.removeEventListener('keyup', keyUpHandler); gameState = 'end'; });

        function buildLevel() { /* ... (Lógica para construir el nivel) ... */ }
        function resetLevel() { balls = []; createBall(canvas.width/2, canvas.height-30); paddle.x = (canvas.width-paddle.width)/2; powerUps = []; }
        function activatePowerUp(type) { playSound('assets/sounds/powerup.mp3'); if(type==='wide'){ paddle.width=120; setTimeout(()=>paddle.width=80, 8000);} else if(type==='multi'){ createBall(paddle.x + paddle.width/2, canvas.height - 30);}}
        
        function gameLoop() { /* ... (El bucle principal del juego con toda la lógica) ... */ }
        
        function draw(){if(gameState==='end')return;ctx.clearRect(0,0,canvas.width,canvas.height);if(gameState==='playing'){drawBricks();drawPaddle();balls.forEach(ball=>{drawBall(ball)});powerUps.forEach(p=>{drawPowerUp(p)});drawUI();collisionDetection();if(rightPressed&&paddle.x<canvas.width-paddle.width)paddle.x+=7;else if(leftPressed&&paddle.x>0)paddle.x-=7;balls.forEach((ball,index)=>{ball.x+=ball.dx;ball.y+=ball.dy;if(ball.x+ball.dx>canvas.width-ball.radius||ball.x+ball.dx<ball.radius)ball.dx=-ball.dx;if(ball.y+ball.dy<ball.radius)ball.dy=-ball.dy;else if(ball.y+ball.dy>canvas.height-ball.radius){if(ball.x>paddle.x&&ball.x<paddle.x+paddle.width)ball.dy=-ball.dy;else{balls.splice(index,1);if(balls.length===0){lives--;if(!lives)gameState='gameover';else resetLevel()}}}});powerUps.forEach((p,index)=>{p.y+=p.dy;if(p.y>canvas.height)powerUps.splice(index,1);if(p.x<paddle.x+paddle.width&&p.x+p.width>paddle.x&&p.y<canvas.height&&p.y+p.height>canvas.height-paddle.height){activatePowerUp(p.type);powerUps.splice(index,1)}})}else if(gameState==='start')drawGameScreen('BRICK BREAKER','Press Enter to Start');else if(gameState==='gameover')drawGameScreen('GAME OVER','Press Enter to Restart');else if(gameState==='win')drawGameScreen('YOU WIN!','Press Enter to Restart');requestAnimationFrame(draw)}
        function buildLevel(){bricks=[];const t=levels[level];for(let e=0;e<brick.columnCount;e++){bricks[e]=[];for(let n=0;n<brick.rowCount;n++){const o=t[n]?t[n][e]:0;o>0&&(bricks[e][n]={x:0,y:0,status:o})}}}
        function collisionDetection(){for(let t=0;t<brick.columnCount;t++)for(let e=0;e<brick.rowCount;e++){const n=bricks[t][e];n&&n.status>0&&balls.forEach(o=>{if(o.x>n.x&&o.x<n.x+brick.width&&o.y>n.y&&o.y<n.y+brick.height){o.dy=-o.dy,n.status--,playSound("assets/sounds/hit.mp3"),0===n.status&&(score++,Math.random()<.2&&createPowerUp(n.x+brick.width/2,n.y+brick.height/2));let l=0;bricks.forEach(t=>t.forEach(t=>{t&&t.status>0&&l++})),0===l&&(level+1<levels.length?(level++,buildLevel(),resetLevel()):gameState="win")}})}}
        function drawBall(t){ctx.beginPath(),ctx.arc(t.x,t.y,t.radius,0,2*Math.PI),ctx.fillStyle="#00ff41",ctx.fill(),ctx.closePath()}
        function drawPaddle(){ctx.beginPath(),ctx.rect(paddle.x,canvas.height-paddle.height,paddle.width,paddle.height),ctx.fillStyle="#00ff41",ctx.fill(),ctx.closePath()}
        function drawBricks(){for(let t=0;t<brick.columnCount;t++)for(let e=0;e<brick.rowCount;e++)if(bricks[t][e]&&bricks[t][e].status>0){const n=t*(brick.width+brick.padding)+brick.offsetLeft,o=e*(brick.height+brick.padding)+brick.offsetTop;bricks[t][e].x=n,bricks[t][e].y=o,ctx.beginPath(),ctx.rect(n,o,brick.width,brick.height),ctx.fillStyle=1===bricks[t][e].status?"#00ff41":2===bricks[t][e].status?"#00ffff":"#ff3c3c",ctx.fill(),ctx.closePath()}}
        function drawPowerUp(t){ctx.beginPath(),ctx.rect(t.x,t.y,t.width,t.height),ctx.fillStyle="multi"===t.type?"#ff3c3c":"#00ffff",ctx.fill(),ctx.closePath()}
        function drawUI(){ctx.fillStyle="#00ff41",ctx.font="16px Fira Code",ctx.fillText("Score: "+score,8,20),ctx.fillText("Lives: "+lives,canvas.width-85,20)}
        function drawGameScreen(t,e){ctx.fillStyle="rgba(13, 13, 13, 0.7)",ctx.fillRect(0,0,canvas.width,canvas.height),ctx.fillStyle="#00ff41",ctx.font="32px Fira Code",ctx.textAlign="center",ctx.fillText(t,canvas.width/2,canvas.height/2-20),ctx.font="16px Fira Code",ctx.fillText(e,canvas.width/2,canvas.height/2+20)}
        
        buildLevel(); draw();
    }
    
    //======================================================================
    // 4. LÓGICA DEL ESCRITORIO VIRTUAL (FINAL)
    //======================================================================
    function createAsciiExplosion(e){playSound("assets/sounds/explode.mp3");const t=["[","]","/","*","-","+","-","|","0","1","X","?","#"];for(let n=0;n<40;n++){const o=document.createElement("div");o.className="ascii-particle",o.textContent=t[Math.floor(Math.random()*t.length)],o.style.fontSize=`${15*Math.random()+15}px`,o.style.color=Math.random()>.5?"var(--primary-color)":"var(--text-color)",o.style.left=`${e.clientX}px`,o.style.top=`${e.clientY}px`;const l=360*Math.random(),s=80*Math.random()+120,i=Math.cos(l)*s,a=Math.sin(l)*s;o.style.setProperty("--translate-end",`translate(${i}px, ${a}px) rotate(${720*Math.random()}deg)`),document.body.appendChild(o),setTimeout(()=>o.remove(),800)}}
    function createWindow(e,t,n){playSound("assets/sounds/open.mp3");const o=document.createElement("div");return o.className="window","about-me"===e&&o.classList.add("window-about-me"),"game"===e&&o.classList.add("window-game"),o.dataset.id=e,o.style.zIndex=++highestZIndex,o.innerHTML=`<div class="window-header"><span class="title">${t}</span><span class="header-btn close-btn">[x]</span></div><div class="window-body">${n}</div>`,desktop.appendChild(o),makeDraggable(o,o.querySelector(".window-header")),o.querySelector(".close-btn").addEventListener("click",()=>o.remove()),o.addEventListener("mousedown",()=>{o.style.zIndex=++highestZIndex},{capture:!0}),"about-me"===e&&o.querySelectorAll(".skill-item").forEach(e=>e.addEventListener("click",createAsciiExplosion)),o}
    function openViewerWindow(e,t){const n=`viewer-${e[t].name.replace(/\s+/g,"-")}`;if(document.querySelector(`.window[data-id="${n}"]`))return void(document.querySelector(`.window[data-id="${n}"]`).style.zIndex=++highestZIndex);let o=t;const l=createWindow(n,e[o].name,""),s=l.querySelector(".window-body");s.classList.add("viewer-content");const i=t=>{const n=e[t];if(l.querySelector(".title").textContent=n.name,s.innerHTML="","image"===n.type){s.innerHTML=`<img src="${n.url}" alt="${n.name}">`;const o=document.createElement("div");o.className="viewer-overlay";const i=document.createElement("button");i.className="image-info-btn",i.textContent="i";const a=document.createElement("div");a.className="image-meta-box";let d=`<div class="meta-box-header"><h4>Metadatos</h4><button class="meta-box-close-btn">&times;</button></div><p>${n.description||""}</p>`;n.metadata&&(d+=`<br>${Object.entries(n.metadata).map(([e,t])=>`<strong>${e.toUpperCase()}:</strong> ${t}`).join("<br>")}`),a.innerHTML=d,o.appendChild(i),o.appendChild(a),s.appendChild(o),i.onclick=()=>a.classList.toggle("show"),a.querySelector(".meta-box-close-btn").onclick=()=>a.classList.remove("show")}else"video"===n.type?s.innerHTML=`<video src="${n.url}" controls autoplay loop></video>`:"3d"===n.type&&(s.innerHTML=`<model-viewer src="${n.url}" alt="${n.name}" camera-controls auto-rotate></model-viewer>`);const a=t=>{o=(o+t+e.length)%e.length,i(o)},d=document.createElement("button");d.className="viewer-nav prev-btn",d.innerHTML="&#10094;",d.onclick=()=>a(-1);const c=document.createElement("button");c.className="viewer-nav next-btn",c.innerHTML="&#10095;",c.onclick=()=>a(1),s.appendChild(d),s.appendChild(c)};i(o)}
    function openFolderWindow(e){const t=desktopFiles[e];if(!t||document.querySelector(`.window[data-id="${e}"]`))return;if("game"===t.type){const n=createWindow(e,t.title,"");n.classList.add("window-game");const o=document.createElement("canvas");o.id="gameCanvas",n.querySelector(".window-body").appendChild(o);const l=o.parentElement.clientWidth,s=o.parentElement.clientHeight;return o.width=l,o.height=s,void initBrickBreaker(o,n)}let n="";if("text"===t.type)n=t.content;else if("folder"===t.type)for(const o of t.content)n+=`<div class="file-item" data-type="${o.type}" data-url="${o.url}" data-name="${o.name}"><img src="https://img.icons8.com/ios-filled/50/00ff41/file.png" alt="file"><p>${o.name}</p></div>`;createWindow(e,t.title,n)}
    function makeDraggable(e,t){let n,o,l,s;t.onmousedown=i=>{i.preventDefault(),l=i.clientX,s=i.clientY,document.onmouseup=()=>{document.onmouseup=null,document.onmousemove=null},document.onmousemove=i=>{i.preventDefault(),n=l-i.clientX,o=s-i.clientY,l=i.clientX,s=i.clientY,e.style.top=`${e.offsetTop-o}px`,e.style.left=`${e.offsetLeft-n}px`}}}
    
    //======================================================================
    // 5. EVENT LISTENERS Y EJECUCIÓN
    //======================================================================
    const startBtn=document.getElementById("start-btn"),startMenu=document.getElementById("start-menu");
    typeWriter(); updateClock(); setInterval(updateClock, 1000);
    terminalInput.addEventListener('click', e => { if (e.target.tagName === 'BUTTON') startPortfolio(); });
    desktop.addEventListener('dblclick', e => {
        const icon = e.target.closest('.desktop-icon');
        if (icon) { playSound('assets/sounds/click.mp3'); openFolderWindow(icon.dataset.folder); }
        const fileItem = e.target.closest('.file-item');
        if (fileItem) {
            const parentWindow = fileItem.closest('.window'), folderId = parentWindow.dataset.id;
            const viewableItems = desktopFiles[folderId].content.filter(item => ["image", "video", "3d"].includes(item.type));
            const startIndex = viewableItems.findIndex(item => item.url === fileItem.dataset.url);
            if (startIndex !== -1) { openViewerWindow(viewableItems, startIndex); }
        }
    });
    startBtn.addEventListener("click",e=>{e.stopPropagation(),startMenu.classList.toggle("hidden")}),startMenu.addEventListener("click",e=>{const t=e.target.closest(".start-menu-item");t&&(openFolderWindow(t.dataset.folder),startMenu.classList.add("hidden"))}),document.addEventListener("click",e=>{e.target.closest("#start-menu")||e.target.closest("#start-btn")||startMenu.classList.add("hidden")});
});

