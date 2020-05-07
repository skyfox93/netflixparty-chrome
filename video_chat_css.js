

console.log
if(window.href.location.includes('https://meet.jit.si')){
        document.querySelector('head').append(
    `<style>
    .videocontainer{
        width: 100% ! important;
        height: 25% !important
    }
    .remote-videos-container{height: 100% !important}
    </style>`
    )
}
