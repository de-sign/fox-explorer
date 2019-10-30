const
    fs = require('fs'),
    path = require('path');

module.exports = {
    components: {
        'content-list-item-date': require('./ContentListItemDate'),
        'content-list-item-menu': require('./ContentListItemMenu')
    },

    props: {
        sPath: String
    },
    computed: {
        oStat(){
            return fs.statSync(this.sPath);
        },
        sName() {
            return path.basename(this.sPath);
        },
        nId() {
            return this.oStat.ino;
        },
        sType() {
            return this.oStat.isDirectory() ? 'directory' : 'file';
        },
        sIcon() {
            return this.oStat.isDirectory() ? 'folder' : 'file-text';
        },
        oDate() {
            return {
                dCreated: this.oStat.birthtime,
                dModify: this.oStat.mtime
            };
        }
    },

    methods: {
        action(sAction) {
            switch( sAction ){
                case 'open':
                    this.$root.$emit('content-list-item-' + sAction, this.sType, this.sPath);
                    break;
                case 'rename':
                    this.$refs.hInput.focus();
                    this.$refs.hInput.select();
                    break;
                case 'move':
                    console.log('TODO move');
                    break;
                case 'delete':
                    this.$parent.$emit('content-list-item-' + sAction, this);
                    break;
            }
        },

        rename(oEvent) {
            this.$parent.$emit('content-list-item-rename', this, oEvent.target.value.trim());
        }
    },

    template: `
        <article uk-grid @dblclick="action('open')" class="uk-card uk-link-toggle uk-flex-middle uk-margin-small-bottom uk-margin-remove-top">
            <div class="uk-card-header uk-width-auto uk-padding-remove-right">
                <div :uk-icon="'ratio: 1.8; icon: ' + sIcon"></div>
            </div>
            <div class="uk-card-footer uk-width-auto uk-padding-remove">
                <content-list-item-menu @action="action"></content-list-item-menu>
            </div>
            <div class="uk-card-body uk-width-expand uk-padding-remove">
                <h3 class="uk-margin-remove-bottom">
                    <input
                        type="text"
                        class="uk-link-heading uk-card-title"
                        ref="hInput"
                        :value="sName"
                        @change="rename"
                    />
                </h3>
                <content-list-item-date :o-date="oDate"></content-list-item-date>
            </div>
        </article>
    `
};