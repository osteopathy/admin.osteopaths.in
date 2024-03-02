import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return param === 'bos' || param === 'mos' || param === 'ios';
};