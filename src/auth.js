var apiKey = 'AIzaSyCw-tiI-qvlc5_4pCVjfaNXm-1_a9G2-N0';
 
 var discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
 
 var clientId = '342850676381-2kcnojm83o3upsqqg8s51u0mpdv2udmk.apps.googleusercontent.com';
 
 //permissions asked for
 var scopes = "profile" + " " + "https://www.googleapis.com/auth/youtube"
 + " " + "https://www.googleapis.com/auth/youtube.force-ssl"
 + " " + "https://www.googleapis.com/auth/youtube.readonly"
 + " " + "https://www.googleapis.com/auth/youtube.upload";
 
 var authorizeButton = document.getElementById('authorize-button');
 var signoutButton = document.getElementById('signout-button');
 
 //launches auth
 function handleClientLoad() {
   // Load the API client and auth2 library
   gapi.load('client:auth2', initClient);
 }
 
 function initClient() {
   gapi.client.init({
       apiKey: apiKey,
       discoveryDocs: discoveryDocs,
       clientId: clientId,
       scope: scopes
   }).then(function () {
     // Listen for sign-in state changes.
     gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
     // Handle the initial sign-in state.
     updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
   });
 }
 //toggles between signed in element states/toggles
 function updateSigninStatus(isSignedIn) {
   var mes = document.getElementById("message");
   if (isSignedIn) {
     authorizeButton.style.display = 'none';
     mes.style.display = 'none';
     signoutButton.style.display = 'block';
     getPlaylistNames();
   } else {
     document.getElementById('playlistNames').innerHTML = '';
     document.getElementById('content').innerHTML = '';
     mes.style.display = 'block';
     authorizeButton.style.display = 'block';
     signoutButton.style.display = 'none';
   }
 }
 function handleAuthClick(event) {
   gapi.auth2.getAuthInstance().signIn();
 }
 function handleSignoutClick(event) {
   gapi.auth2.getAuthInstance().signOut();
 }