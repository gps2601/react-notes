import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Toggleable from './Toggleable'

describe('<Toggleable />', () => {
  let component

  beforeEach(() => {
    component = render(
      <Toggleable buttonLabel="show...">
        <div className="testDiv" />
      </Toggleable>
    )
  })

  test('renders its children', () => {
    component.container.querySelector('.testDiv')
  })
})