import React, {useState} from 'react';
import DatePicker from 'react-datepicker'

function PostField({field, onChange, ...props}) {
	const [date, setDate] = useState(Date.now());
	const handleDate = (date) => {
		setDate(date)
		onChange(date, field.id);
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
									type={field.input === 'checkbox' ? 'checkbox' : 'radio'}
									value={field.options[ij]}
									checked={props.checked && props.checked.indexOf(field.options[ij]) > -1}
									required={field.required}
									onChange={e => onChange(e)}
								/> 
								{field.input === "tags" ? field.options[ij].tag : field.options[ij]} 
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
					{field.options[jk]} 
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
						onChange={datetime => onChange(datetime, field.id)}
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
			<div> 
				<label htmlFor={field.id}>
					<strong> 
						{field.label} 
					</strong>
				</label>
				<em>
					<small> 
						{field.instructions} 
					</small>
				</em>
			</div>
			{getField()}
		</div>);
}

export default PostField;
