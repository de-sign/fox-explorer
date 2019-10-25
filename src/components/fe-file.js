const oStructureFile = {
    aTime: [
        { sLabel: 'Created on', sField: 'sCreated' },
        { sLabel: 'Modify the', sField: 'sModify' }
    ],
    aMenu: [
        { sLabel: 'Open', sIcon: 'album', sTextColor: 'primary', sClick: 'open' },
        { sLabel: 'Rename', sIcon: 'pencil', sClick: 'rename' },
        { sLabel: 'Move', sIcon: 'move', sClick: 'move' },
        { sLabel: 'Delete', sIcon: 'trash', sTextColor: 'danger', sClick: 'delete' }
    ]
};

module.exports = {
    props: ['oFile'],
    data() {
        return { oStructureFile };
    },
    computed: {
        test() {
            console.log(this, this.oStructureFile);
            return 'OK';
        }
    },
    template: `
        <article uk-grid v-on:dblclick="$emit('open', oFile)" class="uk-card uk-link-toggle uk-flex-middle uk-margin-small-bottom uk-margin-remove-top">
            <div class="uk-card-header uk-width-auto uk-padding-remove-right">
                <div v-bind:uk-icon="'ratio: 2; icon: ' + oFile.sIcon"></div>
            </div>
            <div class="uk-card-footer uk-width-auto uk-padding-small">
                <div uk-icon="more-vertical"></div>
                <div class="uk-padding-small" uk-dropdown="pos: bottom-left">
                    <ul class="uk-nav uk-nav-default">
                        <li v-for="oFileAction in oStructureFile.aMenu">
                            <a href="#" v-bind:class="oFileAction.sTextColor ? 'uk-text-' + oFileAction.sTextColor : ''" v-on:click="$emit(oFileAction.sClick, oFile)">
                                <span class="uk-margin-small-right" v-bind:uk-icon="oFileAction.sIcon"></span>
                                <span class="uk-text-middle">{{ oFileAction.sLabel }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="uk-card-body uk-width-expand uk-padding-remove">
                <h3 class="uk-link-heading uk-card-title uk-margin-remove-bottom">{{ oFile.sName }}</h3>
                <div tabindex="-1" uk-slider="autoplay: true; autoplay-interval: 5000">
                    <ul class="uk-slider-items uk-child-width-1-1">
                        <li v-for="oTime in oStructureFile.aTime">
                            <p class="uk-text-meta uk-margin-remove">
                                {{ oTime.sLabel }} <time v-bind:datetime="oFile[ oTime.sField ]">{{ oFile[ oTime.sField ] }}</time>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </article>
    `
};