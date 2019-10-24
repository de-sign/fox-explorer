const aTypeMap = {
    warning: 'warning',
    info: null
};

module.exports = {
    data() {
        return {
            bShow: false,
            sIcon: null,
            sHtml: null
        };
    },
    computed: {
        sType() {
            return aTypeMap[this.sIcon] ? 'uk-alert-' + aTypeMap[this.sIcon] : null;
        }
    },
    methods: {
        show(sIcon, sHtml) {
            this.sIcon = sIcon;
            this.sHtml = sHtml;
            this.bShow = true;
        },
        hide() {
            this.bShow = false;
        }
    },
    template: `
        <div v-if="bShow" v-bind:class="sType" class="uk-flex-middle uk-grid-small" uk-grid uk-alert >
            <div v-if="sIcon" class="uk-width-auto uk-padding-remove">
                <span v-bind:uk-icon="'ratio: 2; icon: ' + sIcon"></span>
            </div>
            <div class="uk-width-expand">
                <p class="uk-margin-remove" v-html="sHtml"></p>
            </div>
        </div>
    `
};