import React, {useState} from 'react';
import DatePicker from 'react-datepicker'

function PostField({field, onChange, language, isNotValid, ...props}) {
	const [date, setDate] = useState(null);

	const handleDate = (date) => {
		setDate(date)
		onChange(field.id, date);
	}

	const getField = () => {
		switch (field.input) {
			case "textarea":
				return (
					<textarea 
						id={field.id}
						name={field.id}
						required={field.required}
						onChange = {(e) => onChange(e)}
					/>
				);

			case "tags":
			case "radio":
			case "checkbox":
				let elements = [];
				for (var ij = 0; ij < field.options.length; ij++) {
					let element = (
						<span key = {ij}>
							<label htmlFor = {`${field.id}_${ij}`} >
								<input 
									id={`${field.id}_${ij}`}
									name={field.id}
									type={field.input === 'radio' ? 'radio' : 'checkbox'}
									value={field.input === "tags" ? field.options[ij].id : field.options[ij]}
									checked={props.checked && props.checked.indexOf(field.options[ij]) > -1}
									required={field.required}
									onChange={e => onChange(e)}
								/> 
								{field.input === "tags" ? field.options[ij].id : field.options[ij]}
								{field.input === "tags" ?
									(field.options[ij].translations[language] && field.options[ij].translations[language].tag ? field.options[ij].translations[language].tag : field.options[ij].tag) :
									(field.translations[language] && field.translations[language].options && field.translations[language].options[ij] ? field.translations[language].options[ij] : field.options[ij])
								}
							</label> 
							<span className="item-separator" > & nbsp; </span>
						</span>);
					
					elements.push(element);
				}

				return elements;
			case "select":
				let options = []
				for (var jk = 0; jk < field.options.length; jk++) {
					let option = <option key={jk} value={field.options[jk]}> 
					{field.translations[language] && field.translations[language].options && field.translations[language].options[jk] ? field.translations[language].options[jk] : field.options[jk]} 
					</option>

					options[jk] = option;
				}

				return ( 
					<select 
						id={field.id}
						name={field.id}
						onChange={e => onChange(e)}
					>
						{options}
					</select>
				);

			case "datetime":
			case "date":
				return (
					<DatePicker 
						id={field.id}
						name={field.id}
						type={field.input}
						required={field.required}
						selected={date}
						onSelect={date => handleDate(date, field.id)}
						showTimeSelect={field.input === "datetime" ? true : false}
						dateFormat={field.input === "datetime" ? "MMM dd, yyyy HH:mm" : "MMM dd, yyyy"}
					/>
				);
			default:
				return ( 
					<input 
						id={field.id}
						name={field.id}
						type={field.label === "User ID" ? "hidden" : field.input}
						value={field.value.value}
						required={field.required}
						onChange={e => onChange(e)}
					/>
				);
			}
		}

	return ( 
		<div className="medium-12 columns">
			<div className={`${isNotValid ? "error" : ''}`}>
				<label htmlFor={field.id}>
					<strong> 
						{field.translations[language] && field.translations[language].label ? field.translations[language].label : field.label} 
					</strong>
					{isNotValid ? <p>this field is required</p>: ''}

				</label>
				<em>
					<small>
					{field.translations[language] && field.translations[language].instructions ? field.translations[language].instructions : field.instructions} 
					</small>
				</em>
			</div>
		</div>);
}

export default React.memo(PostField);
