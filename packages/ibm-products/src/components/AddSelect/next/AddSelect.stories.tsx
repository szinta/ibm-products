/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { AddSelect } from '.';
import styles from './_storybook-styles.scss?inline';
import mdx from './AddSelect.mdx';

const storyClass = 'add-select-next-stories';

export default {
  title: 'Preview/Add and select/AddSelect',
  component: AddSelect,
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      return <div className={`${storyClass}__viewport`}>{Story()}</div>;
    },
  ],
  subcomponents: {
    Body: AddSelect.Body,
    Content: AddSelect.Content,
    Column: AddSelect.Column,
    Row: AddSelect.Row,
    SelectionSummaryPanel: AddSelect.SelectionSummaryPanel,
    SelectionSummaryPanelItem: AddSelect.SelectionSummaryPanelItem,
    ItemInfoPanel: AddSelect.ItemInfoPanel,
  },
  argTypes: {
    children: {
      control: false,
    },
  },
  parameters: {
    styles,
    docs: {
      page: mdx,
    },
  },
};

// Sample data
const simpleItems = [
  {
    id: '1',
    title: 'Item 1',
    subtitle: 'Description for item 1',
    value: 'item-1',
  },
  {
    id: '2',
    title: 'Item 2',
    subtitle: 'Description for item 2',
    value: 'item-2',
  },
  {
    id: '3',
    title: 'Item 3',
    subtitle: 'Description for item 3',
    value: 'item-3',
  },
  {
    id: '4',
    title: 'Item 4',
    subtitle: 'Description for item 4',
    value: 'item-4',
  },
  {
    id: '5',
    title: 'Item 5',
    subtitle: 'Description for item 5',
    value: 'item-5',
  },
];

/**
 * Default story - Basic multi-select with AddSelect.Body and AddSelect.Content
 */
export const Default = () => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleItemSelect = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  return (
    <AddSelect
      multi
      selectedItems={selectedItems}
      onItemSelect={handleItemSelect}
    >
      <AddSelect.Body
        itemsLabel="All items"
        globalSearchLabel="Search"
        globalSearchPlaceholder="Search items"
        itemCount={simpleItems.length}
      >
        <AddSelect.Content>
          {simpleItems.map((item) => (
            <AddSelect.Row
              key={item.id}
              itemId={item.id}
              title={item.title}
              subtitle={item.subtitle}
              value={item.value}
            />
          ))}
        </AddSelect.Content>
      </AddSelect.Body>
    </AddSelect>
  );
};

/**
 * Single select story - Radio button selection
 */
export const SingleSelect = () => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleItemSelect = (itemId: string, selected: boolean) => {
    const newSelected = new Set<string>();
    if (selected) {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  return (
    <AddSelect
      multi={false}
      selectedItems={selectedItems}
      onItemSelect={handleItemSelect}
    >
      <AddSelect.Body
        itemsLabel="Select one item"
        globalSearchLabel="Search"
        itemCount={simpleItems.length}
      >
        <AddSelect.Content>
          {simpleItems.map((item) => (
            <AddSelect.Row
              key={item.id}
              itemId={item.id}
              title={item.title}
              subtitle={item.subtitle}
              value={item.value}
            />
          ))}
        </AddSelect.Content>
      </AddSelect.Body>
    </AddSelect>
  );
};

/**
 * With columns - Using AddSelect.Column for organized layout
 */
export const WithColumns = () => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleItemSelect = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  return (
    <AddSelect
      multi
      selectedItems={selectedItems}
      onItemSelect={handleItemSelect}
    >
      <AddSelect.Body
        itemsLabel="Items"
        globalSearchLabel="Search"
        itemCount={simpleItems.length}
      >
        <AddSelect.Content>
          <AddSelect.Column
            title="Available items"
            showSelectAll
            itemCount={simpleItems.length}
          >
            {simpleItems.map((item) => (
              <AddSelect.Row
                key={item.id}
                itemId={item.id}
                title={item.title}
                subtitle={item.subtitle}
                value={item.value}
              />
            ))}
          </AddSelect.Column>
        </AddSelect.Content>
      </AddSelect.Body>
    </AddSelect>
  );
};

/**
 * With search and filters - Column with search, sort, and filter capabilities
 */
export const WithSearchAndFilters = () => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleItemSelect = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const filteredItems = simpleItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AddSelect
      multi
      selectedItems={selectedItems}
      onItemSelect={handleItemSelect}
    >
      <AddSelect.Body itemsLabel="Items" itemCount={filteredItems.length}>
        <AddSelect.Content>
          <AddSelect.Column
            title="Available items"
            showSearch
            searchPlaceholder="Search items"
            onSearchChange={setSearchTerm}
            showSort
            sortOptions={[{ id: 'title', label: 'Title' }]}
            itemCount={filteredItems.length}
          >
            {filteredItems.map((item) => (
              <AddSelect.Row
                key={item.id}
                itemId={item.id}
                title={item.title}
                subtitle={item.subtitle}
                value={item.value}
              />
            ))}
          </AddSelect.Column>
        </AddSelect.Content>
      </AddSelect.Body>
    </AddSelect>
  );
};

/**
 * With selection summary panel
 */
export const WithSelectionSummaryPanel = () => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleItemSelect = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectedItemsArray = simpleItems.filter((item) =>
    selectedItems.has(item.id)
  );

  return (
    <AddSelect
      multi
      selectedItems={selectedItems}
      onItemSelect={handleItemSelect}
    >
      <AddSelect.Body
        itemsLabel="All items"
        globalSearchLabel="Search"
        itemCount={simpleItems.length}
      >
        <AddSelect.Content layout="horizontal">
          <AddSelect.Column
            title="Available items"
            itemCount={simpleItems.length}
          >
            {simpleItems.map((item) => (
              <AddSelect.Row
                key={item.id}
                itemId={item.id}
                title={item.title}
                subtitle={item.subtitle}
                value={item.value}
              />
            ))}
          </AddSelect.Column>
        </AddSelect.Content>
      </AddSelect.Body>
      <AddSelect.SelectionSummaryPanel
        title="Selected items"
        selectedItems={selectedItemsArray}
        showCount
      />
    </AddSelect>
  );
};

/**
 * With item info panel - Detailed item information
 */
export const WithItemInfoPanel = () => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [infoPanelItemId, setInfoPanelItemId] = useState<string | null>(null);

  const handleItemSelect = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const infoPanelItem = simpleItems.find((item) => item.id === infoPanelItemId);

  return (
    <AddSelect
      multi
      selectedItems={selectedItems}
      onItemSelect={handleItemSelect}
    >
      <AddSelect.Body
        itemsLabel="All items"
        globalSearchLabel="Search"
        itemCount={simpleItems.length}
      >
        <AddSelect.Content layout="horizontal">
          <AddSelect.Column
            title="Available items"
            itemCount={simpleItems.length}
          >
            {simpleItems.map((item) => (
              <AddSelect.Row
                key={item.id}
                itemId={item.id}
                title={item.title}
                subtitle={item.subtitle}
                value={item.value}
                hasInfoPanel
                onInfoPanelClick={setInfoPanelItemId}
                infoPanelOpen={infoPanelItemId === item.id}
              />
            ))}
          </AddSelect.Column>
        </AddSelect.Content>
      </AddSelect.Body>
      {infoPanelItem && (
        <AddSelect.ItemInfoPanel
          title="Item details"
          item={infoPanelItem}
          onClose={() => setInfoPanelItemId(null)}
        />
      )}
    </AddSelect>
  );
};
