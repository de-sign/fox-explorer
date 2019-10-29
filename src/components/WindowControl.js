module.exports = {
    data() {
        return {
            bMaximized: true,
            aControl: [
                { sIcon: 'minus', sAction: 'minimize' },
                { sIcon: 'expand', sAction: 'maximize', visible: () => !this.bMaximized },
                { sIcon: 'shrink', sAction: 'unmaximize', visible: () => this.bMaximized },
                { sIcon: 'close', sAction: 'close' }
            ]
        };
    },
    computed: {
        aVisibleControl() {
            return [...this.aControl].filter( oControl => {
                return oControl.visible ?
                    oControl.visible.call(this) :
                    true;
            } );
        }
    },

    methods: {
        use(sAction) {
            efm.windows.main[sAction]();
            if( sAction == 'maximize' || sAction == 'unmaximize' ){
                this.bMaximized = efm.windows.main.isMaximized();
            }
        }
    },
    
    template: `
        <ul class="fe-app-no-drag uk-padding-small uk-iconnav">
            <li v-for="oControl in aVisibleControl">
                <a href="#" :uk-icon="oControl.sIcon" @click="use(oControl.sAction)"></a>
            </li>
        </ul>
    `
};