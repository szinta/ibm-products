/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  forwardRef,
  ForwardedRef,
  ReactNode,
  useState,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ToastNotification } from '@carbon/react';
import { breakpoints } from '@carbon/layout';
import { AddSelect } from '../../../../../components/AddSelect/next';
import { AddSelectData, AddSelectItem } from '@carbon/ibm-products-primitives';
import { AddSelectContext } from '../../../../../components/AddSelect/next/context';
import { Tearsheet } from '../../../../../components/Tearsheet/next';
import { NoDataEmptyState } from '../../../../../components/EmptyStates';
import { useMatchMedia } from '../../../../../global/js/hooks/useMatchMedia';
import './MultiAddSelectWithHierarchy.scss';

const blockClass = `multi-add-select-hierarchy-pattern`;

/**
 * MultiAddSelectWithHierarchy Pattern - A complete pattern with Tearsheet for multi-selection with hierarchy
 * Uses recursive column generation to display hierarchy levels side-by-side
 */

export interface MultiAddSelectWithHierarchyProps {
  /**
   * Whether the tearsheet is open
   */
  open: boolean;
  /**
   * Callback to set open state
   */
  setOpen: (open: boolean) => void;
  /**
   * Array of hierarchical items to display
   */
  items: AddSelectItem[];
  /**
   * Callback when items are submitted
   */
  onSubmit?: (itemIds: string[], values: string[]) => void;
  /**
   * Title for the tearsheet
   */
  title?: string;
  /**
   * Description for the tearsheet
   */
  description?: ReactNode;
  /**
   * Label for items section
   */
  itemsLabel?: string;
  /**
   * Global search label
   */
  globalSearchLabel?: string;
  /**
   * Global search placeholder
   */
  globalSearchPlaceholder?: string;
  /**
   * Search results title
   */
  searchResultsTitle?: string;
  /**
   * No results title
   */
  noResultsTitle?: string;
  /**
   * No results description
   */
  noResultsDescription?: string;
  /**
   * Title for the selection summary panel
   */
  selectionSummaryTitle?: string;
  /**
   * Empty state title when no items selected
   */
  noSelectionTitle?: string;
  /**
   * Empty state description when no items selected
   */
  noSelectionDescription?: string;
  /**
   * Primary button text
   */
  primaryButtonText?: string;
  /**
   * Secondary button text
   */
  secondaryButtonText?: string;
  /**
   * Success notification title
   */
  successNotificationTitle?: string;
  /**
   * Success notification subtitle template (use {count} for item count)
   */
  successNotificationSubtitle?: string;
  /**
   * Placeholder for column search
   */
  columnSearchPlaceholder?: string;
  /**
   * Column title
   */
  columnTitle?: string;
  /**
   * Optional class name
   */
  className?: string;
}

/**
 * Recursive Column Component
 * Automatically generates columns side-by-side as user navigates hierarchy
 */
interface ColumnProps {
  items: AddSelectItem[];
  onShowInfo?: (itemId: string) => void;
  columnSearchPlaceholder?: string;
  columnTitle?: string;
  level: number;
  dataManager: AddSelectData;
}

const RecursiveColumn: React.FC<ColumnProps> = ({
  items,
  onShowInfo,
  columnSearchPlaceholder = 'Find',
  columnTitle,
  level,
  dataManager,
}) => {
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [columnSearchTerm, setColumnSearchTerm] = useState('');
  const parentContext = useContext(AddSelectContext);

  // Filter items based on column search
  const filteredItems = useMemo(() => {
    if (!columnSearchTerm) {
      return items;
    }
    return items.filter((item) => {
      const titleMatch = item.title
        ?.toLowerCase()
        .includes(columnSearchTerm.toLowerCase());
      const valueMatch = item.value
        ?.toLowerCase()
        .includes(columnSearchTerm.toLowerCase());
      return titleMatch || valueMatch;
    });
  }, [items, columnSearchTerm]);

  // Get children of active parent
  const activeParentChildren = useMemo(() => {
    if (!activeParentId) return null;
    const parent = items.find((item) => item.id === activeParentId);
    return parent?.children?.entries || null;
  }, [activeParentId, items]);

  const handleColumnSearch = (term: string) => {
    setColumnSearchTerm(term);
  };

  // Create a custom navigation handler for this column
  const handleNavigate = (itemId: string, title: string, parentId: string) => {
    setActiveParentId(itemId);
  };

  const title = columnTitle || `Level ${level}`;

  // Provide custom context with this column's navigation handler
  const columnContext = {
    ...parentContext,
    onNavigate: handleNavigate,
  };

  return (
    <AddSelectContext.Provider value={columnContext}>
      <AddSelect.Column
        title={title}
        searchPlaceholder={columnSearchPlaceholder}
        onSearch={handleColumnSearch}
        itemCount={filteredItems.length}
        multi={true}
      >
        {filteredItems.map((item) => {
          const hasChildren =
            item.children?.entries && item.children.entries.length > 0;
          return (
            <AddSelect.Row
              key={item.id}
              itemId={item.id}
              title={item.title || ''}
              subtitle={item.subtitle}
              value={item.value || ''}
              icon={item.icon}
              disabled={item.disabled}
              hasChildren={hasChildren}
              hasInfoPanel={!!item.meta}
              onInfoPanelClick={onShowInfo}
            />
          );
        })}
      </AddSelect.Column>

      {/* Recursively render next column if there are children */}
      {activeParentChildren && activeParentChildren.length > 0 && (
        <RecursiveColumn
          key={activeParentId}
          items={activeParentChildren}
          onShowInfo={onShowInfo}
          columnSearchPlaceholder={columnSearchPlaceholder}
          level={level + 1}
          dataManager={dataManager}
        />
      )}
    </AddSelectContext.Provider>
  );
};

export const MultiAddSelectWithHierarchy = forwardRef<
  HTMLDivElement,
  MultiAddSelectWithHierarchyProps
>(
  (
    {
      open,
      setOpen,
      items,
      onSubmit,
      title = 'Add items',
      description = 'Select items from the list below',
      itemsLabel = 'Items',
      globalSearchLabel = 'Search',
      globalSearchPlaceholder = 'Search items',
      searchResultsTitle = 'Search results',
      noResultsTitle = 'No results found',
      noResultsDescription = 'Try adjusting your search',
      selectionSummaryTitle = 'Selected items',
      noSelectionTitle = 'No items selected',
      noSelectionDescription = 'Select items from the list',
      primaryButtonText = 'Add',
      secondaryButtonText = 'Cancel',
      successNotificationTitle = 'Success',
      successNotificationSubtitle = '{count} item{plural} added',
      columnSearchPlaceholder = 'Find',
      columnTitle,
      className,
      ...rest
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    // Initialize data manager
    const dataManager = useMemo(() => new AddSelectData(), []);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [currentItems, setCurrentItems] = useState<AddSelectItem[]>([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [infoPanel, setInfoPanel] = useState<{
      item: AddSelectItem | null;
      show: boolean;
    }>({ item: null, show: false });

    // Calculate button size based on screen size
    const smMediaQuery = `(max-width: ${breakpoints.md.width})`;
    const isSm = useMatchMedia(smMediaQuery);
    const buttonSize = isSm ? 'xl' : '2xl';

    // Initialize data manager with items
    useEffect(() => {
      dataManager.setItems(items);
      setCurrentItems(items);
    }, [items, dataManager]);

    // Reset state when tearsheet opens
    useEffect(() => {
      if (open) {
        setSelectedIds(new Set());
        setSearchTerm('');
        setInfoPanel({ item: null, show: false });
      }
    }, [open]);

    // Handle item selection
    const handleItemSelect = (
      itemId: string,
      selected: boolean,
      value: string
    ) => {
      const newSelectedIds = new Set(selectedIds);

      if (selected) {
        newSelectedIds.add(itemId);
        dataManager.setSelectedItems(itemId, true);
      } else {
        newSelectedIds.delete(itemId);
        dataManager.setSelectedItems(itemId, false);
      }

      setSelectedIds(newSelectedIds);
    };

    // Handle global search
    const handleGlobalSearch = (term: string) => {
      setSearchTerm(term);

      if (term) {
        // Use the data manager's search functionality
        const results = dataManager.search(term, {
          caseSensitive: false,
          searchFields: ['title', 'value', 'subtitle'],
        });
        setCurrentItems(results);
      } else {
        // Reset to root items
        setCurrentItems(items);
      }
    };

    // Handle removing item from selection summary
    const handleRemoveItem = (itemId: string) => {
      const item = dataManager.getItem(itemId);
      if (item) {
        handleItemSelect(itemId, false, item.value || '');
      }
    };

    // Handle close
    const handleClose = () => {
      setOpen(false);
    };

    // Handle submit
    const handleSubmit = () => {
      if (selectedIds.size > 0) {
        const selectedIdsArray = Array.from(selectedIds);
        const selectedValues = selectedIdsArray.map((id) => {
          const item = dataManager.getItem(id);
          return item?.value || '';
        });

        onSubmit?.(selectedIdsArray, selectedValues);
        handleClose();

        // Show success notification
        const count = selectedIds.size;
        const message = successNotificationSubtitle
          .replace('{count}', count.toString())
          .replace('{plural}', count > 1 ? 's' : '');
        setNotificationMessage(message);
        setShowNotification(true);
      }
    };

    // Handle show info
    const handleShowInfo = (itemId: string) => {
      const item = dataManager.getItem(itemId);
      if (item && item.meta) {
        setInfoPanel({ item, show: true });
      }
    };

    // Handle close info
    const handleCloseInfo = () => {
      setInfoPanel({ item: null, show: false });
    };

    // Get selected items for display
    const selectedItemsForDisplay = useMemo(() => {
      return Array.from(selectedIds)
        .map((id) => dataManager.getItem(id))
        .filter((item): item is AddSelectItem => item !== undefined);
    }, [selectedIds, dataManager]);

    return (
      <>
        <Tearsheet
          ref={ref}
          open={open}
          onClose={handleClose}
          variant="wide"
          summaryContentWidth="22.5rem"
          className={cx(blockClass, className)}
          {...rest}
        >
          <Tearsheet.Header hideCloseButton>
            <Tearsheet.HeaderContent title={title}>
              <p slot="description">{description}</p>
            </Tearsheet.HeaderContent>
          </Tearsheet.Header>

          <Tearsheet.Body>
            <Tearsheet.MainContent>
              <AddSelect
                multi={true}
                onItemSelect={handleItemSelect}
                selectedItems={selectedIds}
              >
                <AddSelect.Body
                  itemsLabel={itemsLabel}
                  globalSearchLabel={globalSearchLabel}
                  globalSearchPlaceholder={globalSearchPlaceholder}
                  searchResultsTitle={searchResultsTitle}
                  itemCount={currentItems.length}
                  onSearch={handleGlobalSearch}
                >
                  <AddSelect.Content layout="horizontal">
                    {currentItems.length > 0 ? (
                      <RecursiveColumn
                        items={currentItems}
                        onShowInfo={handleShowInfo}
                        columnSearchPlaceholder={columnSearchPlaceholder}
                        columnTitle={columnTitle}
                        level={1}
                        dataManager={dataManager}
                      />
                    ) : (
                      <div className={`${blockClass}__no-results`}>
                        <h4>{noResultsTitle}</h4>
                        <p>{noResultsDescription}</p>
                      </div>
                    )}
                  </AddSelect.Content>
                </AddSelect.Body>
              </AddSelect>
            </Tearsheet.MainContent>

            <Tearsheet.SummaryContent className="summary-content-no-padding">
              {infoPanel.show && infoPanel.item ? (
                <AddSelect.ItemSummaryPanel
                  title="Item details"
                  item={infoPanel.item.meta}
                  onClose={handleCloseInfo}
                  closeIconDescription="Close details"
                />
              ) : (
                <AddSelect.SelectionSummary
                  title={selectionSummaryTitle}
                  selectedItems={selectedItemsForDisplay}
                  emptyState={
                    <div style={{ marginBlockStart: '3rem' }}>
                      <NoDataEmptyState
                        illustrationTheme="light"
                        size="sm"
                        title={noSelectionTitle}
                        subtitle={noSelectionDescription}
                      />
                    </div>
                  }
                >
                  {selectedItemsForDisplay.map((item) => (
                    <AddSelect.SelectionSummaryItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemoveItem}
                      useAccordion={true}
                    />
                  ))}
                </AddSelect.SelectionSummary>
              )}
            </Tearsheet.SummaryContent>
          </Tearsheet.Body>

          <Tearsheet.Footer
            actions={[
              {
                kind: 'secondary',
                label: secondaryButtonText,
                onClick: handleClose,
              },
              {
                kind: 'primary',
                label: primaryButtonText,
                onClick: handleSubmit,
                disabled: selectedIds.size === 0,
              },
            ]}
            buttonSize={buttonSize}
          />
        </Tearsheet>

        {showNotification && (
          <ToastNotification
            aria-label="closes notification"
            caption={new Date().toLocaleTimeString()}
            className="notification"
            kind="success"
            lowContrast
            onClose={() => setShowNotification(false)}
            role="status"
            statusIconDescription="notification"
            subtitle={notificationMessage}
            title={successNotificationTitle}
          />
        )}
      </>
    );
  }
);

MultiAddSelectWithHierarchy.propTypes = {
  className: PropTypes.string,
  columnSearchPlaceholder: PropTypes.string,
  columnTitle: PropTypes.string,
  description: PropTypes.node,
  globalSearchLabel: PropTypes.string,
  globalSearchPlaceholder: PropTypes.string,
  /**@ts-ignore */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool,
      icon: PropTypes.node,
      id: PropTypes.string.isRequired,
      meta: PropTypes.node,
      subtitle: PropTypes.string,
      title: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  itemsLabel: PropTypes.string,
  noResultsDescription: PropTypes.string,
  noResultsTitle: PropTypes.string,
  noSelectionDescription: PropTypes.string,
  noSelectionTitle: PropTypes.string,
  /**@ts-ignore */
  onSubmit: PropTypes.func,
  /**@ts-ignore */
  open: PropTypes.bool.isRequired,
  primaryButtonText: PropTypes.string,
  searchResultsTitle: PropTypes.string,
  secondaryButtonText: PropTypes.string,
  selectionSummaryTitle: PropTypes.string,
  /**@ts-ignore */
  setOpen: PropTypes.func.isRequired,
  successNotificationSubtitle: PropTypes.string,
  successNotificationTitle: PropTypes.string,
  title: PropTypes.string,
};

MultiAddSelectWithHierarchy.displayName = 'MultiAddSelectWithHierarchy';

// Made with Bob
