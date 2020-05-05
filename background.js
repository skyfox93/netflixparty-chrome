'use strict';






// only load for URLs that match www.netflix.com/watch/*
let videoChatTabId = null


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
          chrome.tabs.executeScript(tabs[0].id, {file: 'content_script.js', matchAboutBlank: true})
        }
      )
    }

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        console.log('recievedMessage')
       if (message.type == 'requestCreateSession') {
         openInActiveTab()
       }
       if (message.type == 'scriptReady'){
           if(sender.tab){
               videoChatTabId = sender.tab.id
           }
           sendResponse({type: 'createSession'})
       }
   })
chrome.tabs.onRemoved.addListener(function(oldId) {
    console.log(oldId, videoChatTabId)
    if(oldId === videoChatTabId){
        openInActiveTab();
    //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab

    };
})
chrome.tabs.onUpdated.addListener(function(tabId){
    if (tabId === videoChatTabId){
        try{
            chrome.tabs.sendMessage(tabId, {type:'areYouStillThere'}, response => {
                if (!response){
                    chrome.tabs.sendMessage(tabId, {requestCreateSession})
                }
            })
        }

        catch{
            chrome.tabs.sendMessage(tabId, {type: 'requestCreateSession'})
        }
    }

})


chrome.tabs.onReplaced.addListener(function(oldId, newID) {
    console.log(oldId, videoChatTabId)

    if(tabId === videoChatTabId)
    openInActiveTab('createSession');
    //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab

});
