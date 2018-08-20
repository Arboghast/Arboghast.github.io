 //store api response data
 var queueCounter = 0;
 var queue = []; 
 var onclickData = [];
// var datas = {}; debugging
 var id = [];
 var unavailable = [];
 var unavailableCounter = 0;
 
 function getPlaylistNames() { 
   gapi.client.youtube.playlists.list({
       'part' : 'snippet',
       'mine' : 'true',
       'maxResults': '25' 
       /*
          TODO: make this function recursive so all playlists are displayed
       */
   }).then(function(resp){
       //datas = resp; debugging
       var div = document.getElementById('playlistNames');
       for(var i = 0; i < resp.result.items.length; i++)
       {
           id.push(resp.result.items[i].id); //storing playlist id, index being order of playlist
           
           var text = document.createElement("div");
           text.onclick = Function("wipeContent();" + "getPlaylistVideos(" + i + ");");
           text.setAttribute("class","playlistText");
           text.setAttribute("value",i);
           text.innerHTML = resp.result.items[i].snippet.title;
           div.appendChild(text);
           /*
              TODO: Make a better HTML template using tilda feature in js
           */
       }
   });
 }

 function getPlaylistVideos(index){ 
     gapi.client.youtube.playlistItems.list({
       'part' : 'snippet,contentDetails',
       'mine' : 'true',
       'playlistId' : "" + id[index]+ "", //retrieve playlist id from passed in playlist position in id data.
       'maxResults' : 50 
     }).then(function(resp){
       
         var div = document.getElementById("content"); 
         for(var i = 0; i < resp.result.items.length; i++)
         {
           var vid = document.createElement("p");
           vid.setAttribute("class", "vidTemplate");
           var title = resp.result.items[i].snippet.title;
           //console.log(resp.result.items[i].snippet);
           if(title == "Deleted video" || title == "Private video")
               {
                 unavailable[unavailableCounter] = resp.result.items[i].snippet.position;
                 unavailableCounter++;
                 continue;
               }
           vid.setAttribute("onclick","addToQueue("+ resp.result.items[i].snippet.position +",this);");
           var thumbnail = resp.result.items[i].snippet.thumbnails.default.url
           var img = document.createElement("img");
           onclickData[resp.result.items[i].snippet.position] = 
           {
                 
             id : resp.result.items[i].snippet.resourceId.videoId,
             title : title,
             thumb: thumbnail
           };               
           img.setAttribute("src", thumbnail); 
           img.setAttribute("class", "video");
           var text = document.createElement("center");
           text.innerHTML = title;
           text.setAttribute("class", "title");
           vid.appendChild(img);
           vid.appendChild(text);
           div.appendChild(vid);
           /*
                TODO: Everything in this forloop can be replaced with better HTML template using tilda technique
            */
         }
         if(resp.result.hasOwnProperty("nextPageToken")) {    //initial jumpstart for recursion
           getPlaylistVideos2(index,resp.result.nextPageToken); 
         }
     });
 }
 function getPlaylistVideos2(index,nextPageToken) { 
   gapi.client.youtube.playlistItems.list({
           'part' : 'snippet,contentDetails',
           'playlistId' : "" + id[index]+ "",
           'pageToken' : nextPageToken,
           'maxResults' : 50 
         }).then(function(resp){
           var div = document.getElementById("content"); 
             for(var i = 0; i < resp.result.items.length; i++)
             {
               var vid = document.createElement("p");
               vid.setAttribute("class", "vidTemplate");
               var title = resp.result.items[i].snippet.title;
               //console.log(resp.result.items[i].snippet);
               if(title == "Deleted video" || title == "Private video")
               {
                 unavailable[unavailableCounter] = resp.result.items[i].snippet.position;
                 unavailableCounter++;
                 continue;
               }
               vid.setAttribute("onclick","addToQueue("+resp.result.items[i].snippet.position+",this);");
               var thumbnail = resp.result.items[i].snippet.thumbnails.default.url
               var img = document.createElement("img");
               onclickData[resp.result.items[i].snippet.position] = 
               {
                 
                 id : resp.result.items[i].snippet.resourceId.videoId,
                 title : title,
                 thumb: thumbnail
               };
               img.setAttribute("src", thumbnail);
               img.setAttribute("class", "video"); 
               var text = document.createElement("center");
               text.innerHTML = title;
               text.setAttribute("class", "title");
               vid.appendChild(img);
               vid.appendChild(text);
               div.appendChild(vid);
               /*
                TODO: Everything in this forloop can be replaced with better HTML template using tilda technique
            */
             }
             if(resp.result.hasOwnProperty("nextPageToken")) {  //recursive base case
                   makeApiCallVideo2(index,resp.result.nextPageToken);
             }
         });
 }
 
 function addToQueue(scraps,theHtml)
 {
   var datas =  onclickData[scraps];

   var vid = document.createElement("p");
   vid.setAttribute("class", "vidTemplate");
   vid.setAttribute("onclick","download("+datas.id+");removeFromQueue();");
   var img = document.createElement("img");
   img.setAttribute("src", datas.thumb);
   img.setAttribute("class", "video"); 
   var text = document.createElement("center");
   text.innerHTML = datas.title;
   text.setAttribute("class", "title");
   vid.appendChild(img);
   vid.appendChild(text);

   queue[queueCounter] = {
     id : datas.id,
     html : vid
   }
   queueCounter++;
 }
 function clearQueue()
 {
   queue = [];
   queueCounter =0;
 }
 function showLost()
 {
   for(var i = 0; i < unavailable.length; i++)
   {
     document.getElementById("unavail").innerHTML += unavailable[i] + "<br>";
   }
   document.getElementById("unavail").style.display = "block";
   document.getElementById("togg").innerHTML = "hide";
   document.getElementById("togg").onclick = function onclick(event) { hideLost(); };
 }
 function hideLost()
 {
   document.getElementById("unavail").innerHTML = "";
   document.getElementById("unavail").style.display = "none";
   document.getElementById("togg").innerHTML = "show";
   document.getElementById("togg").onclick = function onclick(event) { showLost(); };
 }
 function showQueue()
 {
   for(var i = queueCounter-1; i >= 0; i--)
   {
     var html = queue[i].html;
     document.getElementById("queue").appendChild(html);
   }
   document.getElementById("queue").style.display = "block";
   document.getElementById("togg2").innerHTML = "hide queue"; 
   document.getElementById("togg2").onclick = function onclick(event) { hideQueue(); };
 }
 function hideQueue()
 {
   document.getElementById("queue").innerHTML = "";
   document.getElementById("queue").style.display = "block";
   document.getElementById("togg2").innerHTML = "show queue";
   document.getElementById("togg2").onclick = function onclick(event) { showQueue(); };
 }
 function clearUnavail()
 {
   unavailable = [];
   unavailableCounter = 0;
 }

 function wipeContent()
 {
   document.getElementById("content").innerHTML = '';
 }
 