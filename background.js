'use strict';


chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});



let videoChatTabId = null
let videoSessionName = null
let videoPlayerTab = null
let jitsiTabId = null
function sendCreateMessage(tabId){
        chrome.tabs.sendMessage(tabId,{
            type: 'createSession',
            data: null
        })
    }
function openInActiveTab(type, data, callback) {
    chrome.tabs.query({
      active: true,
      currentWindow: true},
      function(tabs){
                    console.log(tabs)
                    chrome.tabs.executeScript(tabs[0].id, {file: 'content_script.js'})
        }
      )
    }

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        console.log('recievedMessage')
        console.log(message, videoSessionName)
        // request that script be run
       if (message.type === 'requestCreateSession' && videoSessionName) {

         openInActiveTab()
       }
       else if( message.type ==='requestCreateSession'){
           window.open('https://meet.jit.si')
       }

       // script has loaded
       if (message.type === 'scriptReady' && videoSessionName){
           if(sender.tab && sender.tab.id === videoPlayerTab){
               console.log("sendingResponse")
               sendResponse({type: 'createSession', sessionName: videoSessionName, promptUser: true})

           }
           else{
               sendResponse({type: 'createSession', sessionName: videoSessionName})

           }

       }
       // user has successfullyLogged In
       if( message.type === 'userLaunchedSession'){
           if(sender.tab){
               if(videoChatTabId || jitsiTabId){
                   if((videoChatTabId && videoChatTabId !== sender.tab.id) || jitsiTabId && jitsiTabId !== sender.tab.id){
                       try{
                           chrome.tabs.remove(videoChatTabId || jitsiTabId)
                       }
                       catch{

                       }

                   }
               }
               chrome.tabs.executeScript(sender.tab.id, {file: 'video_chat_css.js', allFrames: true})

               videoChatTabId = sender.tab.id
       }
       }

       if(message.type ==='userEndedSession'){
           videoChatTabId = null
           videoSessionName = null
       }

   })

chrome.tabs.onRemoved.addListener(function(oldId) {
    console.log(oldId, videoChatTabId)
    if(oldId === videoChatTabId && videoSessionName){
        if( oldId !== jitsiTabId){
            window.open('https://meet.jit.si/');
            videoChatTabId = null

        }
        else if (oldId === jitsiTabId){
            jitsiTabId = null
            videoSessionName = null
        }
    //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab
    };
    if(oldId === videoPlayerTab){
        videoPlayerTab = null
    }
})

chrome.tabs.onUpdated.addListener(function(tabId){
    console.log('tab.on Updated fired')
    try{
        chrome.tabs.query({
          url: 'https://meet.jit.si/*'
        },
          function(tabs){
              if(tabs.length > 0 && tabs[0].url.replace('https://meet.jit.si/', '').length > 3){
                  videoSessionName = tabs[0].url.replace('https://meet.jit.si/', '')
                  jitsiTabId = tabs[0].id
                  console.log(videoSessionName)
              }
              else{
                  jitsiTabId = null
              }
            }
          )
    }



    catch{

    }

    chrome.tabs.query({
      url: ['https://www.netflix.com/watch/*', 'https://www.hulu.com/watch', 'https://www.play.hbogo.com/*', 'https://www.amazon.com/Amazon-Video']

  }, function(tabs){
      if(tabs.length > 0){
          videoPlayerTab = tabs[0].id
          console.log( 'found Video player')
          if(videoSessionName){
              chrome.tabs.executeScript(videoPlayerTab, {file: 'content_script.js'})
        }
      }
  })
    if (tabId === videoChatTabId && videoSessionName){
        try{
            chrome.tabs.sendMessage(tabId, {type:'areYouStillThere', sessionName: videoSessionName}, response => {
                if (!response){
                    chrome.tabs.executeScript(tabId, {file: 'content_script.js'})

                }
            })
        }
        catch{
            chrome.tabs.executeScript(tabId, {file: 'content_script.js'})
        }
    }

})


chrome.tabs.onUpdated.addListener(function(){
    console.log('tab.on Updated fired')
        chrome.tabs.query({
        },
          function(tabs){
            console.log(tabs)
            }
          )
    })


chrome.tabs.onReplaced.addListener(function(oldId, newID) {
    console.log(oldId, videoChatTabId)
    if(tabId === videoChatTabId && videoSessionName){
        openInActiveTab('createSession');
    }

});
