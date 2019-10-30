module.exports = {
    data() {
        return {
            aAction: [
                { sLabel: 'Refresh', sIcon: 'refresh', sClick: 'refresh' },
                { sLabel: 'Create file', sIcon: 'file-text', sClick: 'create-file' },
                { sLabel: 'Create directory', sIcon: 'folder', sClick: 'create-directory' }
            ]
        }
    },

    methods: {
        action(sAction){
            switch( sAction ){
                case 'refresh':
                    this.$root.$emit('content-menu-' + sAction);
                    break;
                case 'create-directory':
                    this.$root.$emit('content-menu-create', 'directory');
                    break;
                case 'create-file':
                    this.$root.$emit('content-menu-create', 'file');
                    break;
            }
        }
    },
    
    template: `
        <ul class="uk-nav-default" uk-nav>
            <li v-for="oAction in aAction">
                <a
                    href="#"
                    class="uk-visible@s"
                    :class="oAction.sTextColor ? 'uk-text-' + oAction.sTextColor : ''"
                    @click="action(oAction.sClick)"
                >
                    <span :uk-icon="'ratio: 0.8; icon: ' + oAction.sIcon"></span>
                    <span class="uk-margin-small-left uk-margin-small-right uk-text-middle">{{ oAction.sLabel }}</span>
                </a>
                <a
                    href="#"
                    class="uk-hidden@s"
                    :class="oAction.sTextColor ? 'uk-text-' + oAction.sTextColor : ''"
                    :uk-tooltip="'pos: right; title: ' + oAction.sLabel"
                    @click="action(oAction.sClick)"
                >
                    <span class="uk-display-block" :uk-icon="'ratio: 0.8; icon: ' + oAction.sIcon"></span>
                </a>
            </li>
        </ul>
    `
};