const aClass = {
    warning: 'warning',
    info: null
};

module.exports = {
    props: {
        sIcon: String,
        sHtml: String
    },
    computed: {
        sClass() {
            return aClass[this.sIcon] ? 'uk-alert-' + aClass[this.sIcon] : null;
        }
    },
    
    template: `
        <div :class="sClass" class="uk-flex-middle uk-grid-small" uk-grid uk-alert >
            <div v-if="sIcon" class="uk-width-auto uk-padding-remove">
                <span :uk-icon="'ratio: 2; icon: ' + sIcon"></span>
            </div>
            <div class="uk-width-expand">
                <p class="uk-margin-remove" v-html="sHtml"></p>
            </div>
        </div>
    `
};