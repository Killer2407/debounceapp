//Codility Question!

import React, { useCallback, useState } from 'react';
// import classnames from 'classnames';
// you should import `lodash` as a whole module
import lodash from 'lodash';
import axios from 'axios';

const ITEMS_API_URL = 'https://example.com/api/items';
const DEBOUNCE_DELAY = 500;

// the exported component can be either a function or a class

export default function App(props) {
  const [options, showOptions] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [dropDownOptions, setDropdownOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDropDown = (val) => {
    setDropdownOptions([]);
    setLoading(true);
    axios
      .get(`${ITEMS_API_URL}?q=${val}`)
      .then((res) => {
        setDropdownOptions(res.data.splice(0, 10));
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        showOptions(false);
      });
  };

  const debounceDropDown = useCallback(
    lodash.debounce((nextValue) => getDropDown(nextValue), DEBOUNCE_DELAY),
    []
  );

  const onInputChangeHandler = (e) => {
    const nextValue = e.target.value;
    setSearchString(nextValue);
    debounceDropDown(nextValue);
  };

  const onSelectItem = useCallback((val) => {
    setDropdownOptions([]);
    setSearchString('');
    alert('Selected: ' + val);
  }, []);

  return (
    <>
      <div className="wrapper">
        <div className={loading ? 'is-loading control' : 'control'}>
          <input
            type="text"
            className="input"
            onChange={onInputChangeHandler}
            value={searchString}
          />
        </div>

        {dropDownOptions.length > 0 ? (
          <div className={'list'}>
            {dropDownOptions.length > 0
              ? dropDownOptions.map((value) => {
                  return (
                    <a
                      key={value}
                      onClick={() => onSelectItem(props.onSelectItem(value))}
                      class="list-item"
                    >
                      {value}
                    </a>
                  );
                })
              : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
