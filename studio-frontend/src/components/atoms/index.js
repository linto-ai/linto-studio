import Avatar from './Avatar.vue';
import PhIcon from './PhIcon.vue';
import ButtonPopover from './ButtonPopover.vue';
import TimeDuration from './TimeDuration.vue';
import SwitchInput from './SwitchInput.vue';
import UserProfilePicture from './UserProfilePicture.vue';
import Checkbox from './Checkbox.vue';
import Chip from './Chip.vue';
import ContextMenu from './ContextMenu.vue';
import LabeledValue from './LabeledValue.vue';
import LabeledValueSmall from './LabeledValueSmall.vue';
import OrganizationBadge from './OrganizationBadge.vue';
import Qrcode from './Qrcode.vue';
import Radio from './Radio.vue';
import StatusLed from './StatusLed.vue';
import Badge from './Badge.vue';
import IsCloud from './IsCloud.vue';
import Tag from './Tag.vue';

const components = [
  Avatar,
  PhIcon,
  ButtonPopover,
  TimeDuration,
  SwitchInput,
  UserProfilePicture,
  Checkbox,
  Chip,
  ContextMenu,
  LabeledValue,
  LabeledValueSmall,
  OrganizationBadge,
  Qrcode,
  Radio,
  StatusLed,
  Badge,
  IsCloud,
  Tag,
];

const validateComponents = c => c && typeof c.name === 'string' && c.name.length > 0


export default {
  install(Vue) {
    components.forEach(component => {
      if (validateComponents(component)) {
        Vue.component(component.name, component);
      } else {
        console.error(`Component ${JSON.stringify(component)} is missing a name property`);
      }
    });
  },
}
