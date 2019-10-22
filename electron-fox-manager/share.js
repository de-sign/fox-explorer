module.exports = (electron) => {

    // Ajout des PROP et METHOD communs aux deux processus dans ELECTRON
    return Object.assign(electron, {
        
        // Permet ajout de multiples EVENT via OBJECT par TARGET.on(...)
        onWithObject(oTarget, oEventListener) {
            for( let sEvent in oEventListener ){
                oTarget.on(sEvent, oEventListener[sEvent]);
            }
        }
    });
};