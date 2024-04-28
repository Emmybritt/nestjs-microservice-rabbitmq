import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
} from '@casl/ability';
import { AuthUser } from '@travel-booking-platform/types';

export const defineAbilitiesFor = (u: AuthUser) => {
  const { can, build, cannot } = new AbilityBuilder(createMongoAbility);

  return build({
    // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
    detectSubjectType: (item) => {
      return (
        item['resourceType'] || (item.constructor as ExtractSubjectType<any>)
      );
    },
  });
};
