<?php
// Connection Component Binding
Doctrine_Manager::getInstance()->bindComponent('Cal', 'moqold');

/**
 * BaseCal
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @property integer $numwk
 * @property string $strnumwk
 * 
 * @package    ##PACKAGE##
 * @subpackage ##SUBPACKAGE##
 * @author     ##NAME## <##EMAIL##>
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
abstract class BaseCal extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('cal');
        $this->hasColumn('numwk', 'integer', 8, array(
             'type' => 'integer',
             'length' => 8,
             'fixed' => false,
             'unsigned' => false,
             'primary' => false,
             'default' => '0',
             'notnull' => true,
             'autoincrement' => false,
             ));
        $this->hasColumn('strnumwk', 'string', 5, array(
             'type' => 'string',
             'length' => 5,
             'fixed' => false,
             'unsigned' => false,
             'primary' => false,
             'default' => '',
             'notnull' => true,
             'autoincrement' => false,
             ));
    }

    public function setUp()
    {
        parent::setUp();
        
    }
}