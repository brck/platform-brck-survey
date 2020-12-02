import React from 'react';
import languageList from './helpers/language-list.json';

function LanguageSwitch({languages, onChange}) {
  const languageOptions = [];
  languageList.forEach(lang => {
    if(languages.indexOf(lang.code) > -1) {
			languageOptions.push(lang);
		}
	});
	return (
		<div className="medium-12 columns">
			<div>
				<label htmlFor='languageSwitch'>
					<strong>
						Select language to view and reply in
					</strong>
				</label>
			</div>
			<select onChange={e => onChange(e)}>
					{languageOptions.map((lang, index) => <option key={index} value={lang.code}>{lang.name}</option>)}
			</select>
		</div>
	);
}

export default LanguageSwitch;
