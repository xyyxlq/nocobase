import { useCollectionDataSource, SchemaInitializerItemOptions, useCompile, useCollectionManager } from '@nocobase/client';

import { ScheduleConfig } from './ScheduleConfig';
import { SCHEDULE_MODE } from './constants';
import { NAMESPACE, lang } from '../../locale';
import { CollectionBlockInitializer } from '../../components/CollectionBlockInitializer';
import { defaultFieldNames, getCollectionFieldOptions } from '../../variable';
import { FieldsSelect } from '../../components/FieldsSelect';

export default {
  title: `{{t("Schedule event", { ns: "${NAMESPACE}" })}}`,
  type: 'schedule',
  fieldset: {
    config: {
      type: 'void',
      'x-component': 'ScheduleConfig',
      'x-component-props': {},
    },
  },
  scope: {
    useCollectionDataSource,
  },
  components: {
    ScheduleConfig,
  },
  useVariables(config, opts) {
    const compile = useCompile();
    const { getCollectionFields } = useCollectionManager();
    const { fieldNames = defaultFieldNames } = opts;
    const options: any[] = [];
    if (!opts?.types || opts.types.includes('date')) {
      options.push({ key: 'date', value: 'date', label: lang('Trigger time') });
    }

    // const depth = config.appends?.length
    //   ? config.appends.reduce((max, item) => Math.max(max, item.split('.').length), 1) + 1
    //   : 1;

    if (config.mode === SCHEDULE_MODE.COLLECTION_FIELD) {
      const [fieldOption] = getCollectionFieldOptions({
        // depth,
        ...opts,
        fields: [
          {
            collectionName: config.collection,
            name: 'data',
            type: 'hasOne',
            target: config.collection,
            uiSchema: {
              title: lang('Trigger data'),
            },
          }
        ],
        appends: ['data', ...(config.appends?.map((item) => `data.${item}`) || [])],
        compile,
        getCollectionFields,
      });
      if (fieldOption) {
        options.push(fieldOption);
      }
    }
    return options;
  },
  useInitializers(config): SchemaInitializerItemOptions | null {
    if (!config.collection) {
      return null;
    }

    return {
      type: 'item',
      title: `{{t("Trigger data", { ns: "${NAMESPACE}" })}}`,
      component: CollectionBlockInitializer,
      collection: config.collection,
      dataSource: '{{$context.data}}',
    };
  },
  initializers: {},
};
