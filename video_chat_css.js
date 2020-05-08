

console.log('loaded video chat script');
console.log(window.location.href)
if(window.location.href.includes('https://meet.jit.si')){
    styleEl = document.createElement('style')
    styleEl.innerHTML = `
    .videocontainer.display-video, .videocontainer.display-name-on-video{
        width: 100% ! important;
        height: calc(100vw * 0.5) !important
    }
    .remote-videos-container{height: 100% !important;}`
        document.querySelector('head').appendChild(styleEl)

}
