module.exports = {

    props: {
        oDate: Object
    },
    data() {
        return {
            aLabel: [
                { sLabel: 'Created on', sField: 'dCreated' },
                { sLabel: 'Modify the', sField: 'dModify' }
            ]
        }
    },
    computed: {
        aDate() {
            const aDate = [];
            for( let i in this.aLabel ){
                const dDate = this.oDate[ this.aLabel[i].sField ];
                if( dDate ){
                    aDate.push( {
                        sLabel: this.aLabel[i].sLabel,
                        sValue: dDate.toDateString() + ', ' + dDate.toTimeString().replace(/\(.+?\)/g, '')
                    } );
                }
            }
            return aDate;
        }
    },

    template: `
        <div tabindex="-1" uk-slider="autoplay: true; autoplay-interval: 5000">
            <ul class="uk-slider-items uk-child-width-1-1">
                <li v-for="oDate in aDate">
                    <p class="uk-text-meta uk-margin-remove">
                        {{ oDate.sLabel }} <time :datetime="oDate.sValue">{{ oDate.sValue }}</time>
                    </p>
                </li>
            </ul>
        </div>
    `
};