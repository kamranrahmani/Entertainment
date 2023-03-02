const options = {
    autoplay:3000,
    hoverpause: true,
    keyboard: true,
    animationDuration: 1000,
    type: 'carousel',
    animationTimingFunc: 'ease-in-out' ,
    perView: 3,
    breakpoints: {
        768: {
        perView: 2
        }
    },
}
new Glide('.glide', options).mount()