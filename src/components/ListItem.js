module.exports = {
    props: ['oFile'],
    components: {
        'list-item-menu': require('./ListItemMenu')
    },
    data() {
        return {
            aTime: [
                { sLabel: 'Created on', sField: 'sCreated' },
                { sLabel: 'Modify the', sField: 'sModify' }
            ]
        };
    },
    template: `
        <article uk-grid @dblclick="$emit('open', oFile)" class="uk-card uk-link-toggle uk-flex-middle uk-margin-small-bottom uk-margin-remove-top">
            <div class="uk-card-header uk-width-auto uk-padding-remove-right">
                <div :uk-icon="'ratio: 2; icon: ' + oFile.sIcon"></div>
            </div>
            <div class="uk-card-footer uk-width-auto uk-padding-small">
                <list-item-menu @action="$emit($event, oFile)"></list-item-menu>
            </div>
            <div class="uk-card-body uk-width-expand uk-padding-remove">
                <h3 class="uk-link-heading uk-card-title uk-margin-remove-bottom">{{ oFile.sName }}</h3>
                <div tabindex="-1" uk-slider="autoplay: true; autoplay-interval: 5000">
                    <ul class="uk-slider-items uk-child-width-1-1">
                        <li v-for="oTime in aTime">
                            <p class="uk-text-meta uk-margin-remove">
                                {{ oTime.sLabel }} <time :datetime="oFile[ oTime.sField ]">{{ oFile[ oTime.sField ] }}</time>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </article>
    `
};