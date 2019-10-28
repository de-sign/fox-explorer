module.exports = {
    data() {
        return {
            bMaximized: true,
            aControl: [
                { sIcon: 'minus', sControl: 'minimize' },
                { sIcon: 'expand', sControl: 'maximize', visible: () => !this.bMaximized },
                { sIcon: 'shrink', sControl: 'unmaximize', visible: () => this.bMaximized },
                { sIcon: 'close', sControl: 'close' }
            ]
        };
    },
    computed: {
        aVisibleControl() {
            return [...this.aControl].filter( oControl => {
                console.log(oControl, oControl.visible ?
                    oControl.visible.call(this) :
                    true);
                return oControl.visible ?
                    oControl.visible.call(this) :
                    true;
            } );
        }
    },
    methods: {
        use(sControl) {
            efm.windows.main[sControl]();
            if( sControl == 'maximize' || sControl == 'unmaximize' ){
                this.bMaximized = efm.windows.main.isMaximized();
            }
        }
    },
    template: `
        <ul class="fe-app-no-drag uk-padding-small uk-iconnav">
            <li v-for="oControl in aVisibleControl">
                <a href="#" :uk-icon="oControl.sIcon" @click="use(oControl.sControl)"></a>
            </li>
        </ul>
    `
};