console.log('funcionando')

document.addEventListener('click',(e)=>{
    if(e.target.dataset.short){
        const url = `${location.origin}/${e.target.dataset.short}`

        navigator.clipboard
            .writeText(url)
            .then(()=>{
                console.log('Texto Copiado')
            })
            .catch((err)=>{
                console.log('Texto NO copiado')
            })
    }

})

