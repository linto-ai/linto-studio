import Avatar from './Avatar.vue';
import PhIcon from './PhIcon.vue';
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
import Popover from './Popover.vue';
import Box from './Box.vue';
import ChipTag from './ChipTag.vue';
import Alert from './Alert.vue';
import Tooltip from './Tooltip.vue';
import Emoji from './Emoji.vue';
import Button from './Button.vue';
import Breadcrumb from './Breadcrumb.vue';

const components = [
  Avatar,
  PhIcon,
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
  Popover,
  Box,
  ChipTag,
  Alert,
  Tooltip,
  Emoji,
  Button,
  Breadcrumb,
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
