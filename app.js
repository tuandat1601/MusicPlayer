const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player =$(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $(".myBar");
const progressBar = $(".myProgress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const durringTime = $(".durring-time");
const currTime = $(".current-time");
const PlAYER_STORAGE_KEY = "TUAN_DAT";


const app = {

	isPlaying:false,
	isRandom:false,
	isRepeat:false,
	currentIndex:0,
	config:JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) ||{},
	setconfig:function(key,value){
		this.config[key]=value;
		localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
	},
	songs:[
		{
			name:"Em Hát Ai Nghe",
			singer:"Orange",
			path:"./music_store/y2mate.com - Orange  Em Hát Ai Nghe Official MV.mp3",
			image:"./image/orange.jpg",
		},
		{
			name:"Tháng 5",
			singer:"Soobin Hoàng Sơn",
			path:"./music_store/y2mate.com - SOOBIN  THÁNG NĂM Official Music Video.mp3",
			image:"./image/soobin.jpg",
		},
		{
			name:"Bỏ em vào ba lô",
			singer:"Tuấn Đạt",
			path:"./music_store/y2mate.com - Bỏ Em Vào Balo Lofi Ver  Tân Trần x Freak D.mp3",
			image:"./image/pipunhanho.jpg",
		},
	],
	render:function(){
		const htmls=this.songs.map((song,index)=>{
			return `
			<div class="song ${index==this.currentIndex ? "active" :""}" data-index="${index}" >
				<div class="thumb" style="background-image:url('${song.image}')">
				</div>
				<div class="body">
                                	<h3 class="title">${song.name}</h3>
                                	<p class="author">${song.singer}</p>
                            	</div>
				<div class="option">
                                	<i class="fas fa-ellipsis-h"></i>
                            	</div>
			</div>

			`;
		})
		playlist.innerHTML=htmls.join("");
	},
	defineProperties:function(){
		Object.defineProperty(this, "currentSong", {
			get:function(){
				return this.songs[this.currentIndex]
			}
		});
	},

	handleEvents:function(){
		const _this = this;
    		const cdWidth = cd.offsetWidth;
		// Xử lý phóng to / thu nhỏ CD
    		// Handles CD enlargement / reduction
		    document.onscroll= function(){

			const scrollTop =  window.scrollY || document.documentElement.scrollTop
			const newCdWidth = cdWidth - scrollTop;
			cd.style.width = newCdWidth > 0 ? newCdWidth + "px":0;
			cd.style.opacity = newCdWidth/cdWidth;
		   };
		   // Xử lý khi click play
    		// Handle when click play
		    playBtn.onclick=function(){
			    if(_this.isPlaying){
				    audio.pause();
			    }
			    else{
				    audio.play()
			    }
			}
// Khi song được play
    // When the song is played
			audio.onplay=function(){
				_this.isPlaying=true;
				player.classList.add("playing")
				cdThumbAnimate.play();

				_this.render();


			}
			audio.onpause=function(){
				_this.isPlaying=false;
				player.classList.remove("playing")
				cdThumbAnimate.pause();
			}
 				// Xử lý CD quay / dừng
 	   			// Handle CD spins / stops
 	    		const cdThumbAnimate = cdThumb.animate([{transform:"rotate(360deg)"}],
 	    							{duration:10000, iterations:Infinity}
     								);
     				cdThumbAnimate.pause();
				//      xoay cd thum
				// next song
				nextBtn.onclick=function(){

					if(_this.isRandom){
						_this.playRandomSong();
					}
					else{

						_this.nextSong();
					}
					audio.play();
				}
				prevBtn.onclick=function(){
					if(_this.isRandom){
						_this.playRandomSong();
					}
					else{

						_this.prevSong();

					}
					audio.play();
				}
			audio.ontimeupdate=function(e){
				const { duration, currentTime } = e.srcElement;
				if(duration){
					 const progressPercent = (currentTime/duration)*100;
					 progress.style.width=`${progressPercent}%`
				}
				currTime.innerHTML="00"
				let sec;
				let min = (audio.currentTime==null)? 0:
	 			Math.floor(audio.currentTime/60);
				 min = min <10 ? '0'+min:min;
				if(audio.currentTime>=60){
						for(let i=1;i<=60;i++){
							if(Math.floor(audio.currentTime)>=(60*i)&&Math.floor(audio.currentTime)<(60*(i+1))){
								sec = Math.floor(audio.currentTime)-(60*i);
								sec=sec<10?"0"+sec:sec;
							}
						}
					}
					else{
						sec = (isNaN(audio.currentTime)===true)?"0":Math.floor(audio.currentTime)
						sec=sec<10?"0"+sec:sec;
					}

				currTime.innerHTML=min+":"+sec;
			}
			playlist.onclick=function(e){
				const songNode = e.target.closest(".song:not(.active)")

				if(songNode || e.target.closest(".option")){
					// xử lí khi click vào song
					if(songNode){
						// songActive.classList.remove("active");
						console.log(_this.currentIndex);

						_this.currentIndex = Number(songNode.dataset.index);
						_this.loadCurrentSong()
						// _this.render();
						audio.play();

					}
					//xử lí khi click vào option
				}
			}
			progressBar.onclick =function(e){

				const width = this.clientWidth;
  				const clickX = e.offsetX;

  				const duration = audio.duration;
				  audio.currentTime = (clickX/width)*duration;

			}
			randomBtn.onclick=function(e){
				_this.isRandom=!_this.isRandom;
				_this.setconfig("isRepeat", _this.isRepeat);
				randomBtn.classList.toggle("active",_this.isRandom);
			}
			repeatBtn.onclick=function(e){
				_this.isRepeat=!_this.isRepeat;
				  _this.setconfig("isRepeat", _this.isRepeat);
				repeatBtn.classList.toggle("active",_this.isRepeat);

			}
			audio.onended  = function(){
				if(_this.isRepeat){
					audio.play();
				}
				else{
					nextBtn.click();
				}
			}
	//
	},
	loadCurrentSong:function(){
		heading.textContent = this.currentSong.name
		cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
		audio.src = this.currentSong.path
		setTimeout(

			 function(){
				durringTime.innerHTML="00"
				let sec_d;
				let min_d = (isNaN(audio.duration)===true)?"0":Math.floor(audio.duration/60);
				min_d =min_d<10?"0"+min_d:min_d;

					if(audio.duration>=60){
						for(let i=1;i<=60;i++){
							if(Math.floor(audio.duration)>=(60*i)&&Math.floor(audio.duration)<60*(i+1)){
								sec_d = Math.floor(audio.duration)-(60*i);
								sec_d=sec_d<10?"0"+sec_d:sec_d;
							}
						}
					}
					else{
						sec_d = (isNaN(audio.duration)===true)?"0":Math.floor(audio.duration)
						sec_d=sec_d<10?"0"+sec_d:sec_d;
					}

				durringTime.innerHTML=min_d+":"+sec_d;

			}
			,200)
	},
	 scrollToActiveSong:function(){
		 setTimeout(()=>{
			 $(".song.active").scrollIntoView({
				 behavior:"smooth",
				 block:"nearest"
			 })
		 },300)
	 },

	 loadConFig:function(){
		 this.isRandom = this.config.isRandom;
		 this.isRepeat = this.config.isRepeat;

	 },
	nextSong:function(){
		this.currentIndex++;
		if(this.currentIndex>=this.songs.length){
			this.currentIndex=0;
		}
		this.loadCurrentSong();
	},
	prevSong:function(){
		this.currentIndex--;
		if(this.currentIndex<0){
			this.currentIndex=this.songs.length-1;
		}
		this.loadCurrentSong();
	},

	playRandomSong:function(){
		let newIndex ;
		do{
			newIndex = Math.floor(Math.random()*this.songs.length);
		}while(newIndex ===this.currentIndex);
		console.log(newIndex)
		this.currentIndex=newIndex;

		this.loadCurrentSong();
	},
	start : function(){
		this.loadConFig();
		this.defineProperties();
		this.render();
		this.loadCurrentSong();

		this.handleEvents();
		 randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);

	}
}
app.start();
