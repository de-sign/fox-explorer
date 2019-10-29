module.exports = {
    data() {
        return {
            aAction: [
                { sLabel: 'Open', sIcon: 'album', sTextColor: 'primary', sClick: 'open' },
                { sLabel: 'Rename', sIcon: 'pencil', sClick: 'rename' },
                { sLabel: 'Move', sIcon: 'move', sClick: 'move' },
                { sLabel: 'Delete', sIcon: 'trash', sTextColor: 'danger', sClick: 'delete' }
            ]
        }
    },
    
    template: `
        <div>
            <div uk-icon="more-vertical"></div>
            <div class="uk-padding-small" uk-dropdown="pos: bottom-left">
                <ul class="uk-nav uk-nav-default">
                    <li v-for="oAction in aAction">
                        <a
                            href="#"
                            :class="oAction.sTextColor ? 'uk-text-' + oAction.sTextColor : ''"
                            @click="$emit('action', oAction.sClick)"
                        >
                            <span class="uk-margin-small-right" :uk-icon="oAction.sIcon"></span>
                            <span class="uk-text-middle">{{ oAction.sLabel }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    `
};