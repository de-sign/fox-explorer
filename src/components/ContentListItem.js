const
    fs = require('fs'),
    path = require('path');

module.exports = {
    components: {
        'content-list-item-date': require('./ContentListItemDate'),
        'content-list-item-menu': require('./ContentListItemMenu')
    },
    created() {
        this.nId = this.oStat.ino;
        this.sName = path.basename(this.sPath);
        this.sType = this.oStat.isDirectory() ? 'directory' : 'file',
        this.sIcon = this.oStat.isDirectory() ? 'folder' : 'file-text';
        this.oDate = {
            dCreated: this.oStat.birthtime,
            dModify: this.oStat.mtime
        };
    },

    props: {
        sPath: String
    },
    data() {
        return {
            nId: 0,
            sName: '',
            sType: '',
            sIcon: '',
            oDate: {}
        };
    },
    computed: {
        oStat(){
            return fs.statSync( this.sPath );
        }
    },

    methods: {
        action(sAction) {
            
            switch( sAction ){
                case 'open':
                    this.$root.$emit('content-list-item-' + sAction, this);
                    break;

                case 'rename':
                    break;

                case 'move':
                    break;

                case 'delete':
                    this.$parent.$emit('content-list-item-' + sAction, this);
                    break;
            }
        }
    },

    template: `
        <article uk-grid @dblclick="action('open')" class="uk-card uk-link-toggle uk-flex-middle uk-margin-small-bottom uk-margin-remove-top">
            <div class="uk-card-header uk-width-auto uk-padding-remove-right">
                <div :uk-icon="'ratio: 2; icon: ' + sIcon"></div>
            </div>
            <div class="uk-card-footer uk-width-auto uk-padding-small">
                <content-list-item-menu @action="action"></content-list-item-menu>
            </div>
            <div class="uk-card-body uk-width-expand uk-padding-remove">
                <h3 class="uk-link-heading uk-card-title uk-margin-remove-bottom">{{ sName }}</h3>
                <content-list-item-date :o-date="oDate"></content-list-item-date>
            </div>
        </article>
    `
};