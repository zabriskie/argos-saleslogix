define('Mobile/SalesLogix/Views/_MetricListMixin', [
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/aspect',
    './MetricWidget'
], function(
    declare,
    array,
    lang,
    aspect,
    MetricWidget
) {
    return declare('Mobile.SalesLogix.Views._MetricListMixin', null, {
        // Metrics
        metricNode: null,
        metricWidgets: null,
        configurationView: 'metric_configure',
        entityName: '',
        _insertedToolItem: false,

        postMixInProperties: function() {
            this.widgetTemplate =  new Simplate([
            '<div id="{%= $.id %}" title="{%= $.titleText %}" class="overthrow list {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>',
            '{%! $.listHeaderTemplate %}',
            '<a href="#" class="android-6059-fix">fix for android issue #6059</a>',                
            '{%! $.emptySelectionTemplate %}',
            '<ul class="list-content" data-dojo-attach-point="contentNode"></ul>',
            '{%! $.moreTemplate %}',
            '{%! $.listActionTemplate %}',
            '</div>'
            ]);
        },
        /**
         * @property {Simplate}
         * The template used to render the list views header menu.
         *
         */
        listHeaderTemplate: new Simplate([
            '<div class="list-header list-header-hidden" data-dojo-attach-point="listHeader">',
                '<div data-dojo-attach-point="searchNode"></div>',
                '<div class="list-hash-tags" data-dojo-attach-point="hashTagsNode"></div>',
                '<ul data-dojo-attach-point="metricNode" class="metric-list"></ul>',
            '</div>'
        ]),
        createMetricWidgetsLayout: function() {
            return App.preferences && App.preferences.metrics && App.preferences.metrics[this.resourceKind];
        },
        createToolLayout: function() {
            this.inherited(arguments);
            var tbarItem = {
                id: 'configure',
                action: 'navigateToConfigurationView'
            };

            if (this.tools && this.tools.tbar) {
                if (!this._insertedToolItem) {
                    this.tools.tbar.unshift(tbarItem);
                    this._insertedToolItem = true;
                }
            } else {
                this.tools = {
                    tbar: [
                        tbarItem
                    ]
                };
            }

            return this.tools;
        },
        navigateToConfigurationView: function() {
            var view = App.getView(this.configurationView);
            if (view) {
                view.resourceKind = this.resourceKind;
                view.entityName = this.entityName;
                view.show({ returnTo: -1 });
            }
        },
        postCreate: function() {
            this.inherited(arguments);

        },
        destroyWidgets: function() {
            array.forEach(this.metricWidgets, function(widget) {
                widget.destroy();
            }, this);
        },
        // TODO: Be smart about a refresh required (when prefs change)
        onShow: function() {
            this.inherited(arguments);
            this._rebuildWidgets();
        },
        onActivate: function() {
            this.inherited(arguments);
            this._rebuildWidgets();
        },
        _rebuildWidgets: function() {
            this.destroyWidgets();
            this.metricWidgets = [];

            var widgetOptions;
            // Create metrics widgets and place them in the metricNode
            widgetOptions = this.createMetricWidgetsLayout() || [];
            array.forEach(widgetOptions, function(options) {
                if (this._hasValidOptions(options)) {
                    var widget = new MetricWidget(options);
                    widget.placeAt(this.metricNode, 'last');
                    widget.requestData();
                    this.metricWidgets.push(widget);
                }
            }, this);
        },
        _hasValidOptions: function(options) {
            return options 
                && options.queryArgs 
                && options.queryArgs._filterName 
                && options.queryArgs._metricName
        }
    });
});